import type { RequestHandler } from "express";
import multer from "multer";
import { z } from "zod";
import { extractTextFromUpload } from "../utils/file";
import { extractSkills, vectorize, cosine } from "../utils/nlp";
import { SKILL_VOCABULARY, recommendResources } from "../utils/skills";
import { saveAnalysis } from "../db";

export const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const analyzeSchema = z.object({
  jobDescription: z.string().min(10),
  manualSkills: z.array(z.string()).optional().default([]),
  jobTitle: z.string().optional().default(""),
});

export const analyzeHandler: RequestHandler = async (req, res) => {
  try {
    const parsed = analyzeSchema.safeParse({
      jobDescription: (req.body.jobDescription || "").toString(),
      manualSkills: parseArray(req.body.manualSkills),
      jobTitle: (req.body.jobTitle || "").toString(),
    });
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    let resumeText = (req.body.resumeText || "").toString();
    if (!resumeText && req.file) {
      resumeText = await extractTextFromUpload(req.file);
    }

    const candidateSkills = normalizeSkills([
      ...extractSkills(resumeText),
      ...parsed.data.manualSkills,
    ]);

    const requiredSkills = normalizeSkills(extractSkills(parsed.data.jobDescription));

    const universe = buildUniverse(candidateSkills, requiredSkills);
    const candVec = vectorize(universe, candidateSkills);
    const reqVec = vectorize(universe, requiredSkills);

    const sim = cosine(candVec, reqVec);
    const fitScore = Math.round(sim * 100);

    const missingSkills = requiredSkills.filter((s) => !candidateSkills.includes(s));
    const matchedSkills = requiredSkills.filter((s) => candidateSkills.includes(s));

    const recommendations = recommendResources(missingSkills);

    // Optional: semantic similarity using OpenAI embeddings if key exists
    let semanticScore: number | undefined = undefined;
    try {
      if (process.env.OPENAI_API_KEY && resumeText && parsed.data.jobDescription) {
        const [ea, eb] = await Promise.all([
          embedText(resumeText, process.env.OPENAI_API_KEY),
          embedText(parsed.data.jobDescription, process.env.OPENAI_API_KEY),
        ]);
        semanticScore = cosine(ea, eb);
      }
    } catch (e) {
      // ignore errors from external service
    }

    // Persist summary (best-effort)
    try {
      await saveAnalysis({
        createdAt: new Date(),
        jobTitle: parsed.data.jobTitle || inferJobTitle(parsed.data.jobDescription),
        fitScore,
        missingSkills,
        matchedSkills,
        candidateSkills,
        requiredSkills,
      });
    } catch (e) {
      // ignore
    }

    return res.json({
      fitScore,
      missingSkills,
      matchedSkills,
      candidateSkills,
      requiredSkills,
      universe,
      vectors: { candidate: candVec, required: reqVec },
      recommendations,
      semanticScore,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to analyze." });
  }
};

async function embedText(text: string, key: string): Promise<number[]> {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: text.slice(0, 8000),
    }),
  });
  if (!res.ok) throw new Error("Embedding failed");
  const json: any = await res.json();
  return json.data?.[0]?.embedding || [];
}

function parseArray(v: any): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v.map(String);
  try {
    const arr = JSON.parse(String(v));
    return Array.isArray(arr) ? arr.map(String) : [];
  } catch {
    return String(v)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
}

function normalizeSkills(skills: string[]): string[] {
  const seen = new Set<string>();
  for (const s of skills) {
    seen.add(s.toLowerCase());
  }
  return Array.from(seen);
}

function buildUniverse(a: string[], b: string[]): string[] {
  const set = new Set<string>();
  for (const s of a) set.add(s);
  for (const s of b) set.add(s);
  // keep only skills present in vocabulary for stability
  return Array.from(set).filter((s) => SKILL_VOCABULARY.includes(s));
}

function inferJobTitle(text: string): string {
  const t = text.toLowerCase();
  const titles = [
    "data scientist",
    "machine learning engineer",
    "ml engineer",
    "data analyst",
    "software engineer",
    "frontend engineer",
    "backend engineer",
    "full stack engineer",
    "nlp engineer",
  ];
  for (const title of titles) if (t.includes(title)) return title;
  return "Job";
}
