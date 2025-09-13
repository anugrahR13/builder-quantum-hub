import type { RequestHandler } from "express";
import { SKILL_VOCABULARY } from "../utils/skills";

export const skillsList: RequestHandler = (_req, res) => {
  res.json({ count: SKILL_VOCABULARY.length, skills: SKILL_VOCABULARY });
};
