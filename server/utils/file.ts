import pdf from "pdf-parse";
import mammoth from "mammoth";
import type { Express } from "express";

export async function extractTextFromUpload(file: Express.Multer.File): Promise<string> {
  const ext = (file.originalname.split(".").pop() || "").toLowerCase();
  if (ext === "pdf") {
    const data = await pdf(file.buffer);
    return data.text || "";
  }
  if (ext === "docx") {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value || "";
  }
  // Fallback: try to decode as UTF-8 text
  return file.buffer.toString("utf8");
}
