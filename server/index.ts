import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { analyzeHandler, upload } from "./routes/analyze";
import { listReports } from "./routes/reports";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // Demo
  app.get("/api/demo", handleDemo);

  // Analyze resume vs job description
  app.post("/api/analyze", upload.single("resume"), analyzeHandler);

  // Reports
  app.get("/api/reports", listReports);

  return app;
}
