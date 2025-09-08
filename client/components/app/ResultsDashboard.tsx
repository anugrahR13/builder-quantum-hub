import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import type { AnalyzeResponse } from "@shared/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ResultsDashboard({ data }: { data: AnalyzeResponse }) {
  const rows = data.universe.map((s, i) => ({
    skill: s,
    candidate: data.vectors.candidate[i] ?? 0,
    required: data.vectors.required[i] ?? 0,
  }));

  const radarData = rows.map((r) => ({ subject: r.skill, A: r.required, B: r.candidate, fullMark: 1 }));

  return (
    <div className="grid gap-6 lg:grid-cols-3" id="results">
      <Card className="p-6 lg:col-span-2 glow-card">
        <h3 className="font-semibold mb-4">Skill Coverage</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} margin={{ left: 16, right: 16 }}>
              <defs>
                <linearGradient id="gradReq" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(var(--destructive))"/>
                  <stop offset="100%" stopColor="hsl(var(--accent))"/>
                </linearGradient>
                <linearGradient id="gradYou" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(var(--brand-from))"/>
                  <stop offset="50%" stopColor="hsl(var(--brand-via))"/>
                  <stop offset="100%" stopColor="hsl(var(--brand-to))"/>
                </linearGradient>
              </defs>
              <XAxis dataKey="skill" hide />
              <YAxis domain={[0, 1]} ticks={[0, 1]} />
              <Tooltip cursor={{ fill: "hsl(var(--muted))" }} />
              <Bar dataKey="required" fill="url(#gradReq)" name="Required" radius={4} />
              <Bar dataKey="candidate" fill="url(#gradYou)" name="You" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-2">Job Fit Score</h3>
        <p className="text-5xl font-extrabold tracking-tight">{data.fitScore}%</p>
        <p className="text-sm text-muted-foreground mt-2">Cosine similarity between your skills and job requirements.</p>
        <div className="mt-4">
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={false} />
                <PolarRadiusAxis domain={[0, 1]} tick={false} />
                <Radar name="Required" dataKey="A" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.2} />
                <Radar name="You" dataKey="B" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      <Card className="p-6 lg:col-span-3">
        <h3 className="font-semibold mb-2">Missing Skills</h3>
        {data.missingSkills.length === 0 ? (
          <p className="text-sm text-muted-foreground">Great! You meet all listed requirements.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {data.missingSkills.map((s) => (
              <Badge key={s} variant="secondary">{s}</Badge>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-6 lg:col-span-3">
        <h3 className="font-semibold mb-2">Recommended Learning Path</h3>
        {data.recommendations.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recommendations available.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.recommendations.map((r) => (
              <li key={r.url} className="rounded-md border p-3 bg-card">
                <p className="text-xs text-muted-foreground">{r.provider} • {r.type}</p>
                <a className="font-medium underline underline-offset-4" href={r.url} target="_blank" rel="noreferrer">{r.title}</a>
              </li>
            ))}
          </ul>
        )}
        <Button className="mt-4" asChild>
          <a href="#">View full roadmap</a>
        </Button>
      </Card>
    </div>
  );
}
