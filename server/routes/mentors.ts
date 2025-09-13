import type { RequestHandler } from "express";
import { listAnalyses } from "../db";

export const suggestMentors: RequestHandler = async (req, res) => {
  const { missing = [], matched = [] } = req.body || {};
  try {
    const items = await listAnalyses(200);
    const suggestions = items
      .map((it) => {
        const overlap = (missing as string[]).filter((s) => it.candidateSkills?.includes(s)).length;
        const shared = (matched as string[]).filter((s) => it.candidateSkills?.includes(s)).length;
        const score = overlap * 2 + shared;
        return { title: it.jobTitle || "Professional", overlap, shared, score, skills: it.candidateSkills };
      })
      .filter((x) => x.overlap > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((x) => ({ name: x.title, strength: x.score, canHelpWith: missing.filter((m: string) => x.skills?.includes(m)) }));
    res.json({ suggestions });
  } catch (e) {
    res.status(500).json({ error: "failed to suggest mentors" });
  }
};
