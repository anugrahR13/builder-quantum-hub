import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { AnalyzeResponse } from "@shared/api";
import { ResultsDashboard } from "@/components/app/ResultsDashboard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RoadmapTimeline from "@/components/app/RoadmapTimeline";
import SkillTreeGraph from "@/components/app/SkillTreeGraph";

export default function ResultsPage() {
  const [data, setData] = useState<AnalyzeResponse | null>(null);
  const [jobTitle, setJobTitle] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const raw = sessionStorage.getItem("lastAnalysis");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setData(parsed.data as AnalyzeResponse);
        setJobTitle(parsed.jobTitle || "");
      } catch {
        // ignore
      }
    }
  }, [location.key]);

  if (!data) {
    return (
      <section className="container py-16">
        <Card className="p-8 text-center glow-card">
          <h1 className="text-2xl font-bold">No analysis found</h1>
          <p className="text-muted-foreground mt-2">
            Run an analysis on the Home page to view results.
          </p>
          <Button className="mt-4" onClick={() => navigate("/")}>
            Go to Home
          </Button>
        </Card>
      </section>
    );
  }

  return (
    <div className="fade-in-up">
      <section className="container py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Results {jobTitle ? `– ${jobTitle}` : ""}
            </h1>
            <p className="text-muted-foreground mt-1">
              Your personalized Skill Gap analysis and learning plan.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => document.getElementById("roadmap")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-gradient-to-r from-[hsl(var(--brand-from))] via-[hsl(var(--brand-via))] to-[hsl(var(--brand-to))] text-primary-foreground animated-gradient"
            >
              View Roadmap
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                const utter = new SpeechSynthesisUtterance(`Your fit score is ${Math.round((data.fitScore||0))} percent. Missing skills: ${data.missingSkills.slice(0,6).join(', ')}`);
                window.speechSynthesis.speak(utter);
              }}
            >
              Read aloud
            </Button>
          </div>
        </div>
        <div className="mt-8">
          <ResultsDashboard data={data} />
        </div>
      </section>

      <section className="container py-10" id="roadmap">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="p-6 glow-card lg:col-span-2">
            <h2 className="text-2xl font-semibold">Roadmap</h2>
            <p className="text-sm text-muted-foreground mt-1">Drag to reorder. Prerequisites auto-linked. Time estimates included.</p>
            {data.recommendations.length === 0 ? (
              <p className="mt-4 text-muted-foreground">No recommendations available. Try a different job description.</p>
            ) : (
              <div className="mt-4">
                <RoadmapTimeline items={data.recommendations} />
              </div>
            )}
            <div className="mt-6 flex gap-2">
              <Button variant="secondary" onClick={() => navigate("/")}>Analyze another role</Button>
              <Button onClick={async () => { await fetch('/api/progress/award', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ points: 25 }) }); }}>Mark as Started (+25 XP)</Button>
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Skill Tree</h3>
            <SkillTreeGraph matched={data.matchedSkills} missing={data.missingSkills} />
          </Card>
        </div>
      </section>
    </div>
  );
}
