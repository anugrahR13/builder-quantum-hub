import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { analyzeHandler, upload } from "./routes/analyze";
import { listReports } from "./routes/reports";
import { signup, login, me, logout } from "./routes/auth";
import { jobFeed } from "./routes/jobfeed";
import { benchmark } from "./routes/benchmark";
import { skillsList } from "./routes/skills";
import { atsCheck, enhance } from "./routes/resume";
import { agentChat } from "./routes/agent";
import { getProgress, awardXP } from "./routes/progress";

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

  // Auth
  app.post("/api/auth/signup", signup);
  app.post("/api/auth/login", login);
  app.get("/api/auth/me", me);
  app.post("/api/auth/logout", logout);

  // Skills & feed
  app.get("/api/skills", skillsList);
  app.get("/api/job-feed", jobFeed);
  app.get("/api/benchmark", benchmark);

  // Resume enhancement
  app.post("/api/resume/ats", atsCheck);
  app.post("/api/resume/enhance", enhance);

  // AI agent
  app.post("/api/agent/chat", agentChat);

  // Gamification
  app.get("/api/progress", getProgress);
  app.post("/api/progress/award", awardXP);

  return app;
}
