import type { RequestHandler } from "express";
import { randomBytes, createHmac, scryptSync, timingSafeEqual } from "crypto";
import { getClient } from "../db";

const SESSION_NAME = "session";
const SESSION_SECRET = process.env.SESSION_SECRET || randomBytes(32).toString("hex");

type User = {
  _id?: string;
  email: string;
  name?: string;
  passwordHash: string; // format: salt:hash (hex)
  createdAt: Date;
};

const memUsers: User[] = [];

function b64url(input: Buffer | string) {
  const b = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return b
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function signJWT(payload: Record<string, any>) {
  const header = { alg: "HS256", typ: "JWT" };
  const encHeader = b64url(JSON.stringify(header));
  const encPayload = b64url(JSON.stringify(payload));
  const data = `${encHeader}.${encPayload}`;
  const sig = createHmac("sha256", SESSION_SECRET).update(data).digest();
  return `${data}.${b64url(sig)}`;
}

function verifyJWT(token: string): null | Record<string, any> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [h, p, s] = parts;
  const data = `${h}.${p}`;
  const expected = createHmac("sha256", SESSION_SECRET).update(data).digest();
  const got = Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");
  if (expected.length !== got.length || !timingSafeEqual(expected, got)) return null;
  try {
    const json = JSON.parse(Buffer.from(p.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString());
    return json;
  } catch {
    return null;
  }
}

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  const check = scryptSync(password, salt, 64).toString("hex");
  return timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(check, "hex"));
}

function parseCookies(header: string | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    out[k] = decodeURIComponent(rest.join("="));
  }
  return out;
}

async function getUsersCollection() {
  const c = await getClient();
  if (!c) return null;
  const db = c.db();
  return db.collection<User>("users");
}

export const signup: RequestHandler = async (req, res) => {
  const { email, password, name } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "email and password required" });
  try {
    const col = await getUsersCollection();
    const existing = col ? await col.findOne({ email }) : memUsers.find((u) => u.email === email);
    if (existing) return res.status(409).json({ error: "email already registered" });
    const user: User = { email, name, passwordHash: hashPassword(password), createdAt: new Date() };
    if (col) await col.insertOne(user as any);
    else memUsers.push(user);
    const token = signJWT({ sub: email, name, iat: Math.floor(Date.now() / 1000) });
    res.setHeader("Set-Cookie", `${SESSION_NAME}=${token}; HttpOnly; Path=/; SameSite=Lax`);
    res.json({ user: { email, name } });
  } catch (e) {
    res.status(500).json({ error: "failed to signup" });
  }
};

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "email and password required" });
  try {
    const col = await getUsersCollection();
    const user = col ? await col.findOne({ email }) : memUsers.find((u) => u.email === email) || null;
    if (!user || !verifyPassword(password, user.passwordHash)) return res.status(401).json({ error: "invalid credentials" });
    const token = signJWT({ sub: email, name: user.name, iat: Math.floor(Date.now() / 1000) });
    res.setHeader("Set-Cookie", `${SESSION_NAME}=${token}; HttpOnly; Path=/; SameSite=Lax`);
    res.json({ user: { email, name: user.name } });
  } catch (e) {
    res.status(500).json({ error: "failed to login" });
  }
};

export const me: RequestHandler = async (req, res) => {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[SESSION_NAME];
  const payload = token ? verifyJWT(token) : null;
  if (!payload) return res.status(401).json({ user: null });
  res.json({ user: { email: payload.sub, name: payload.name || null } });
};

export const logout: RequestHandler = (_req, res) => {
  res.setHeader(
    "Set-Cookie",
    `${SESSION_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`
  );
  res.json({ ok: true });
};
