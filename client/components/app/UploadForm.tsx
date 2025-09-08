import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SkillTagInput } from "./SkillTagInput";
import type { AnalyzeResponse } from "@shared/api";
import { ResultsDashboard } from "./ResultsDashboard";

export default function UploadForm() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const fd = new FormData();
      if (resumeFile) fd.append("resume", resumeFile);
      if (resumeText) fd.append("resumeText", resumeText);
      fd.append("jobDescription", jobDescription);
      fd.append("jobTitle", jobTitle);
      fd.append("manualSkills", JSON.stringify(skills));
      const res = await fetch("/api/analyze", { method: "POST", body: fd });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as AnalyzeResponse;
      setResult(data);
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    } catch (e: any) {
      setError("Failed to analyze. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="rounded-lg border p-6 bg-card">
        <h3 className="font-semibold mb-1">1. Upload Resume or Paste Text</h3>
        <p className="text-sm text-muted-foreground mb-4">PDF or DOCX supported. Manual entry works too.</p>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="resume">Resume file</Label>
            <Input id="resume" type="file" accept=".pdf,.docx,.txt" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} />
          </div>
          <div>
            <Label htmlFor="resumeText">Or paste resume text</Label>
            <Textarea id="resumeText" rows={6} value={resumeText} onChange={(e) => setResumeText(e.target.value)} placeholder="Paste your resume content here" />
          </div>
          <div>
            <Label>Manual skills</Label>
            <SkillTagInput value={skills} onChange={setSkills} placeholder="e.g. python, pandas, docker" />
          </div>
        </div>
      </section>

      <section className="rounded-lg border p-6 bg-card">
        <h3 className="font-semibold mb-1">2. Paste Job Description</h3>
        <p className="text-sm text-muted-foreground mb-4">We'll parse required skills and compute a Job Fit Score.</p>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="jobTitle">Job title</Label>
            <Input id="jobTitle" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Data Scientist" />
          </div>
          <div>
            <Label htmlFor="jd">Job description</Label>
            <Textarea id="jd" rows={10} value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste job description here" />
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={() => { setResumeFile(null); setResumeText(""); setSkills([]); setJobDescription(""); setJobTitle(""); setResult(null); }}>Reset</Button>
            <Button onClick={onSubmit} disabled={loading || (!resumeFile && !resumeText && skills.length === 0) || jobDescription.trim().length < 10}>
              {loading ? "Analyzing..." : "Analyze"}
            </Button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      </section>

      {result && (
        <section className="lg:col-span-2">
          <ResultsDashboard data={result} />
        </section>
      )}
    </div>
  );
}
