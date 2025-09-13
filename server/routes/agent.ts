import type { RequestHandler } from "express";

export const agentChat: RequestHandler = async (req, res) => {
  const { messages = [] } = req.body || {};
  if (!process.env.OPENAI_API_KEY) return res.json({ reply: "AI is disabled. Set OPENAI_API_KEY." });
  try {
    const system = { role: "system", content: "You are a helpful career mentor AI. Provide concrete, actionable guidance tailored to the user's skills, missing skills, and target roles. Keep answers concise and structured." };
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: "gpt-4o-mini", messages: [system, ...messages], temperature: 0.2 })
    });
    const j: any = await r.json();
    const reply = j.choices?.[0]?.message?.content || "";
    res.json({ reply });
  } catch (e) {
    res.status(500).json({ error: "failed to chat" });
  }
};
