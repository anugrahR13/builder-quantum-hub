import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Step = { id: string; title: string; provider: string; type: string; url: string; hours: number; prereq?: string[] };

export default function RoadmapTimeline({ items }: { items: { title: string; provider: string; type: string; url: string }[] }) {
  const initial = useMemo<Step[]>(() => items.map((r, i) => ({
    id: `${i}-${r.url}`,
    title: r.title,
    provider: r.provider,
    type: r.type,
    url: r.url,
    hours: r.type === "project" ? 10 : r.type === "certification" ? 12 : 8,
    prereq: i > 0 ? [items[i - 1]!.title] : [],
  })), [items]);
  const [steps, setSteps] = useState<Step[]>(initial);
  const [dragId, setDragId] = useState<string | null>(null);

  const onDragStart = (id: string) => setDragId(id);
  const onDragOver = (e: React.DragEvent<HTMLLIElement>, overId: string) => {
    e.preventDefault();
    if (!dragId || dragId === overId) return;
    const cur = steps.slice();
    const from = cur.findIndex((s) => s.id === dragId);
    const to = cur.findIndex((s) => s.id === overId);
    const [m] = cur.splice(from, 1);
    cur.splice(to, 0, m);
    setSteps(cur);
  };
  const total = steps.reduce((a, b) => a + b.hours, 0);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Interactive Roadmap</h3>
        <div className="text-sm text-muted-foreground">Est. completion: ~{total} hrs</div>
      </div>
      <ol className="grid gap-3">
        {steps.map((s, idx) => (
          <li key={s.id}
              draggable
              onDragStart={() => onDragStart(s.id)}
              onDragOver={(e) => onDragOver(e, s.id)}
              className="rounded-md border p-3 bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{idx + 1}. {s.title}</p>
                <p className="text-xs text-muted-foreground">{s.provider} • {s.type} • ~{s.hours}h</p>
                {s.prereq && s.prereq.length > 0 && (
                  <p className="text-xs mt-1">Prerequisites: {s.prereq.join(", ")}</p>
                )}
              </div>
              <Button variant="secondary" asChild><a href={s.url} target="_blank" rel="noreferrer">Open</a></Button>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}
