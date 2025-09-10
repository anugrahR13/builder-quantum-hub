import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SkillTagInput } from "./SkillTagInput";
import type { AnalyzeResponse } from "@shared/api";
import { ResultsDashboard } from "./ResultsDashboard";
import { useNavigate } from "react-router-dom";

export default function UploadForm() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
      if (
        (!data.candidateSkills || data.candidateSkills.length === 0) &&
        !skills.length &&
        !resumeText
      ) {
        setError(
          data.parseWarning ||
            "We couldn't read your resume. Please paste resume text or add manual skills, or use Run Demo.",
        );
        return;
      }
      setResult(data);
      try {
        sessionStorage.setItem(
          "lastAnalysis",
          JSON.stringify({ data, jobTitle }),
        );
      } catch {}
      navigate("/results");
    } catch (e: any) {
      setError("Failed to analyze. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="rounded-xl p-[1px] bg-gradient-to-r from-[hsl(var(--brand-from))] via-[hsl(var(--brand-via))] to-[hsl(var(--brand-to))] animated-gradient">
        <section className="rounded-xl p-6 bg-card">
          <h3 className="font-semibold mb-1">1. Upload Resume or Paste Text</h3>
          <p className="text-sm text-muted-foreground mb-4">
            PDF or DOCX supported. Manual entry works too.
          </p>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="resume">Resume file</Label>
              <Input
                id="resume"
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              />
            </div>
            <div>
              <Label htmlFor="resumeText">Or paste resume text</Label>
              <Textarea
                id="resumeText"
                rows={6}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume content here"
              />
            </div>
            <div>
              <Label>Manual skills</Label>
              <SkillTagInput
                value={skills}
                onChange={setSkills}
                placeholder="e.g. python, pandas, docker"
              />
            </div>
          </div>
        </section>
      </div>

      <div className="rounded-xl p-[1px] bg-gradient-to-r from-[hsl(var(--brand-from))] via-[hsl(var(--brand-via))] to-[hsl(var(--brand-to))] animated-gradient">
        <section className="rounded-xl p-6 bg-card">
          <h3 className="font-semibold mb-1">2. Paste Job Description</h3>
          <p className="text-sm text-muted-foreground mb-4">
            We'll parse required skills and compute a Job Fit Score.
          </p>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="jobTitle">Job title</Label>
              <Input
                id="jobTitle"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Data Scientist"
              />
            </div>
            <div>
              <Label htmlFor="jd">Job description</Label>
              <Textarea
                id="jd"
                rows={10}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste job description here"
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                onClick={async () => {
                  // Demo payload
                  const demoResume = `Experienced Data Scientist with 4+ years using Python, Pandas, NumPy, scikit-learn, TensorFlow, SQL, Docker. Built NLP projects with spaCy and Transformers; deployed on AWS with Docker and CI/CD. Collaborated with React/Node teams.`;
                  const demoJD = `We are hiring a Data Scientist proficient in Python, Pandas, scikit-learn, TensorFlow, SQL. Bonus: NLP (spaCy/Transformers), AWS, Docker.`;
                  const fd = new FormData();
                  fd.append("resumeText", demoResume);
                  fd.append("jobDescription", demoJD);
                  fd.append("jobTitle", "Data Scientist");
                  fd.append(
                    "manualSkills",
                    JSON.stringify([
                      "python",
                      "pandas",
                      "numpy",
                      "scikit-learn",
                      "tensorflow",
                      "sql",
                      "docker",
                      "spacy",
                      "transformers",
                    ]),
                  );
                  setLoading(true);
                  setError(null);
                  try {
                    const res = await fetch("/api/analyze", {
                      method: "POST",
                      body: fd,
                    });
                    const data = (await res.json()) as AnalyzeResponse;
                    try {
                      sessionStorage.setItem(
                        "lastAnalysis",
                        JSON.stringify({ data, jobTitle: "Data Scientist" }),
                      );
                    } catch {}
                    navigate("/results");
                  } catch (e) {
                    setError("Demo failed. Please try again.");
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Run Demo
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setResumeFile(null);
                  setResumeText("");
                  setSkills([]);
                  setJobDescription("");
                  setJobTitle("");
                  setResult(null);
                }}
              >
                Reset
              </Button>
              <Button
                onClick={onSubmit}
                disabled={
                  loading ||
                  (!resumeFile && !resumeText && skills.length === 0) ||
                  jobDescription.trim().length < 10
                }
              >
                {loading ? "Analyzing..." : "Analyze"}
              </Button>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {result?.parseWarning && (
              <p className="text-xs text-muted-foreground">
                {result.parseWarning}
              </p>
            )}
          </div>
        </section>
      </div>

      {/* Results are shown on the /results page after analysis */}
    </div>
  );
}
