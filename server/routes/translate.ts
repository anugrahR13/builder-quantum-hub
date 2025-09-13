import type { RequestHandler } from "express";

export const translate: RequestHandler = async (req, res) => {
  const { text = "", target = "hi" } = req.body || {};
  try {
    if (!process.env.OPENAI_API_KEY) return res.json({ translated: null, note: "OPENAI_API_KEY not set" });
    const prompt = `Translate to ${target} preserving meaning and tone.\n\n${text}`;
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: "gpt-4o-mini", messages: [{ role: "user", content: prompt }], temperature: 0 })
    });
    const j: any = await r.json();
    const translated = j.choices?.[0]?.message?.content || null;
    res.json({ translated });
  } catch (e) {
    res.status(500).json({ error: "failed to translate" });
  }
};
