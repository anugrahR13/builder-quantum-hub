import { useEffect, useState } from "react";

export default function JobTicker() {
  const [items, setItems] = useState<{ skill: string; count: number }[]>([]);
  useEffect(() => {
    let alive = true;
    fetch("/api/job-feed")
      .then((r) => r.json())
      .then((d) => {
        if (alive) setItems(d.topSkills || []);
      })
      .catch(() => {});
    const id = setInterval(() => {
      fetch("/api/job-feed").then((r) => r.json()).then((d) => alive && setItems(d.topSkills || [])).catch(() => {});
    }, 30000);
    return () => { alive = false; clearInterval(id); };
  }, []);
  if (!items.length) return null;
  return (
    <div className="rounded-xl border p-3 bg-card overflow-hidden">
      <div className="whitespace-nowrap animate-[ticker_20s_linear_infinite]">
        {items.map((it) => (
          <span key={it.skill} className="inline-flex items-center gap-2 mr-6 text-sm">
            <span className="h-2 w-2 rounded-full bg-primary inline-block" />
            {it.skill} • {it.count}
          </span>
        ))}
      </div>
      <style>{`@keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }`}</style>
    </div>
  );
}
