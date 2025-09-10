import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { AnalyzeResponse } from "@shared/api";
import { ResultsDashboard } from "@/components/app/ResultsDashboard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
          <p className="text-muted-foreground mt-2">Run an analysis on the Home page to view results.</p>
          <Button className="mt-4" onClick={() => navigate("/")}>Go to Home</Button>
        </Card>
      </section>
    );
  }

  return (
    <div className="fade-in-up">
      <section className="container py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Results {jobTitle ? `– ${jobTitle}` : ""}</h1>
            <p className="text-muted-foreground mt-1">Your personalized Skill Gap analysis and learning plan.</p>
          </div>
          <Button onClick={() => document.getElementById("roadmap")?.scrollIntoView({ behavior: "smooth" })} className="bg-gradient-to-r from-[hsl(var(--brand-from))] via-[hsl(var(--brand-via))] to-[hsl(var(--brand-to))] text-primary-foreground animated-gradient">View Roadmap</Button>
        </div>
        <div className="mt-8">
          <ResultsDashboard data={data} />
        </div>
      </section>

      <section className="container py-10" id="roadmap">
        <Card className="p-6 glow-card">
          <h2 className="text-2xl font-semibold">Roadmap</h2>
          <p className="text-sm text-muted-foreground mt-1">Follow these resources to close your gaps.</p>
          {data.recommendations.length === 0 ? (
            <p className="mt-4 text-muted-foreground">No recommendations available. Try a different job description.</p>
          ) : (
            <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.recommendations.map((r, idx) => (
                <li key={r.url} className="rounded-md border p-4 bg-card">
                  <p className="text-xs text-muted-foreground">Step {idx + 1}</p>
                  <a className="font-medium underline underline-offset-4" href={r.url} target="_blank" rel="noreferrer">{r.title}</a>
                  <p className="text-xs mt-1">{r.provider} • {r.type}</p>
                </li>
              ))}
            </ol>
          )}
          <div className="mt-6 flex gap-2">
            <Button variant="secondary" onClick={() => navigate("/")}>Analyze another role</Button>
            <Button>Mark as Started</Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
