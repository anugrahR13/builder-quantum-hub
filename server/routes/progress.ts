import type { RequestHandler } from "express";
import { getClient } from "../db";

const mem: Record<string, { xp: number; days: string[]; updatedAt: Date }> = {};

async function getCollection() {
  const c = await getClient();
  if (!c) return null;
  return c.db().collection<{ email: string; xp: number; days: string[]; updatedAt: Date }>("progress");
}

function todayStr() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export const getProgress: RequestHandler = async (req, res) => {
  const email = (req.query.email as string) || "guest";
  const col = await getCollection();
  if (col) {
    const doc = await col.findOne({ email });
    return res.json(doc || { email, xp: 0, days: [], updatedAt: new Date() });
  }
  res.json({ email, xp: mem[email]?.xp || 0, days: mem[email]?.days || [], updatedAt: mem[email]?.updatedAt || new Date() });
};

export const awardXP: RequestHandler = async (req, res) => {
  const { email = "guest", points = 10 } = req.body || {};
  const day = todayStr();
  const col = await getCollection();
  if (col) {
    const doc = (await col.findOne({ email })) || { email, xp: 0, days: [], updatedAt: new Date() };
    doc.xp += Number(points) || 0;
    if (!doc.days.includes(day)) doc.days.push(day);
    doc.updatedAt = new Date();
    await col.updateOne({ email }, { $set: doc }, { upsert: true });
    return res.json(doc);
  }
  const d = mem[email] || { xp: 0, days: [], updatedAt: new Date() };
  d.xp += Number(points) || 0;
  if (!d.days.includes(day)) d.days.push(day);
  d.updatedAt = new Date();
  mem[email] = d;
  res.json({ email, ...d });
};
