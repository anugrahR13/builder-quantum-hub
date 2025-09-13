import type { RequestHandler } from "express";
import { listAnalyses } from "../db";

export const benchmark: RequestHandler = async (_req, res) => {
  try {
    const items = await listAnalyses(500);
    if (!items.length) return res.json({ overall: { avg: 0, count: 0 }, byTitle: [] });
    const overallAvg = Math.round(items.reduce((a, b) => a + (b.fitScore || 0), 0) / items.length);
    const by: Record<string, { sum: number; count: number }> = {};
    for (const it of items) {
      const key = it.jobTitle || "Other";
      by[key] = by[key] || { sum: 0, count: 0 };
      by[key].sum += it.fitScore || 0;
      by[key].count += 1;
    }
    const byTitle = Object.entries(by)
      .map(([title, v]) => ({ title, avg: Math.round(v.sum / v.count), count: v.count }))
      .sort((a, b) => b.count - a.count);
    res.json({ overall: { avg: overallAvg, count: items.length }, byTitle });
  } catch (e) {
    res.status(500).json({ error: "failed to compute benchmark" });
  }
};
