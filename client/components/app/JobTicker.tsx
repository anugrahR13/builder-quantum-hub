import { useEffect, useState } from "react";

export default function JobTicker() {
  const [skills, setSkills] = useState<{ skill: string; count: number }[]>([]);
  const [roles, setRoles] = useState<{ title: string; count: number }[]>([]);
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const d = await fetch("/api/job-feed").then((r) => r.json());
        if (!alive) return;
        setSkills(d.topSkills || []);
        setRoles(d.topRoles || []);
      } catch {}
    };
    load();
    const id = setInterval(load, 30000);
    return () => { alive = false; clearInterval(id); };
  }, []);
  if (!skills.length && !roles.length) return null;
  return (
    <div className="rounded-xl border p-3 bg-card overflow-hidden space-y-2">
      <div className="whitespace-nowrap animate-[ticker_20s_linear_infinite]">
        {roles.map((it) => (
          <span key={it.title} className="inline-flex items-center gap-2 mr-6 text-sm">
            <span className="h-2 w-2 rounded-full bg-primary inline-block" />
            {it.title} • {it.count}
          </span>
        ))}
      </div>
      <div className="whitespace-nowrap animate-[ticker_24s_linear_infinite]">
        {skills.map((it) => (
          <span key={it.skill} className="inline-flex items-center gap-2 mr-6 text-sm">
            <span className="h-2 w-2 rounded-full bg-secondary inline-block" />
            {it.skill} • {it.count}
          </span>
        ))}
      </div>
      <style>{`@keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }`}</style>
    </div>
  );
}
