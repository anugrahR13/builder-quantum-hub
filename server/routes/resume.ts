import type { RequestHandler } from "express";

function keywordCoverage(text: string, keywords: string[]): number {
  const t = text.toLowerCase();
  let hit = 0;
  for (const k of keywords) if (new RegExp(`(^|[^a-z0-9])${k}([^a-z0-9]|$)`, "i").test(t)) hit++;
  return Math.round((hit / Math.max(1, keywords.length)) * 100);
}

export const atsCheck: RequestHandler = (req, res) => {
  const { resumeText = "", jobDescription = "" } = req.body || {};
  const len = resumeText.length;
  const wordCount = resumeText.trim().split(/\s+/).filter(Boolean).length;
  const hasContact = /@/.test(resumeText) && /\d{3,}/.test(resumeText);
  const hasSections = /(experience|education|skills|projects)/i.test(resumeText);
  const keywords = (jobDescription as string).toLowerCase().match(/[a-z+#.]{2,}/g) || [];
  const coverage = keywordCoverage(resumeText, Array.from(new Set(keywords)).slice(0, 50));
  const bullets = (resumeText.match(/\n\s*[-•*]/g) || []).length;
  const suggestions: string[] = [];
  if (len < 1000) suggestions.push("Resume seems short; add detail and accomplishments.");
  if (!hasSections) suggestions.push("Add clear sections: Experience, Skills, Education, Projects.");
  if (bullets < 5) suggestions.push("Use concise bullet points to highlight impact.");
  if (!hasContact) suggestions.push("Include email and phone.");
  res.json({ score: Math.round((coverage + (hasSections ? 20 : 0)) / 1.2), wordCount, coverage, suggestions });
};

export const enhance: RequestHandler = async (req, res) => {
  const { resumeText = "", jobDescription = "" } = req.body || {};
  try {
    if (!process.env.OPENAI_API_KEY) return res.json({ improved: null, note: "OPENAI_API_KEY not set" });
    const prompt = `Rewrite the following resume content to better match the job description, keep user's tone, quantify achievements, and keep it ATS-friendly. Return markdown bullet points.\n\nRESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}`;
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: "gpt-4o-mini", messages: [{ role: "user", content: prompt }], temperature: 0.3 })
    });
    const j: any = await r.json();
    const improved = j.choices?.[0]?.message?.content || null;
    res.json({ improved });
  } catch (e) {
    res.status(500).json({ error: "failed to enhance" });
  }
};
