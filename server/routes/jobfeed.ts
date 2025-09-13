import type { RequestHandler } from "express";
import { listAnalyses } from "../db";

export const jobFeed: RequestHandler = async (_req, res) => {
  try {
    const items = await listAnalyses(200);
    const skillFreq = new Map<string, number>();
    const roleFreq = new Map<string, number>();
    for (const it of items) {
      if (it.requiredSkills) for (const s of it.requiredSkills) skillFreq.set(s, (skillFreq.get(s) || 0) + 1);
      if (it.jobTitle) roleFreq.set(it.jobTitle, (roleFreq.get(it.jobTitle) || 0) + 1);
    }
    const topSkills = Array.from(skillFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([skill, count]) => ({ skill, count }));
    const topRoles = Array.from(roleFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([title, count]) => ({ title, count }));
    res.json({ topSkills, topRoles });
  } catch (e) {
    res.status(500).json({ error: "failed to build feed" });
  }
};
