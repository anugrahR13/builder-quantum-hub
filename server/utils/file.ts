import type { Express } from "express";

export async function extractTextFromUpload(file: Express.Multer.File): Promise<string> {
  const ext = (file.originalname.split(".").pop() || "").toLowerCase();
  if (ext === "pdf") {
    const pdf = (await import("pdf-parse")).default as (buf: Buffer) => Promise<{ text: string }>;
    const data = await pdf(file.buffer as any);
    return data.text || "";
  }
  if (ext === "docx") {
    const mammoth = (await import("mammoth")).default as any;
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value || "";
  }
  // Fallback: try to decode as UTF-8 text
  return file.buffer.toString("utf8");
}
