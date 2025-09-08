import type { RequestHandler } from "express";
import { listAnalyses } from "../db";

export const listReports: RequestHandler = async (_req, res) => {
  try {
    const items = await listAnalyses(50);
    res.json({ items });
  } catch (e) {
    res.status(500).json({ error: "Failed to load reports" });
  }
};
