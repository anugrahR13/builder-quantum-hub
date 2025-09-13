import { useMemo } from "react";

export default function SkillTreeGraph({ matched, missing }: { matched: string[]; missing: string[] }) {
  const nodes = useMemo(() => {
    const a = matched.map((s, i) => ({ id: s, group: "have", x: 50 + (i * 40) % 300, y: 40 + Math.floor(i / 8) * 40 }));
    const b = missing.map((s, i) => ({ id: s, group: "need", x: 420 + (i * 40) % 300, y: 40 + Math.floor(i / 8) * 40 }));
    return [...a, ...b];
  }, [matched, missing]);
  const links = useMemo(() => missing.map((m) => ({ source: matched[Math.floor(Math.random() * Math.max(1, matched.length))] || "skills", target: m })), [matched, missing]);
  return (
    <svg viewBox="0 0 800 240" className="w-full h-60 border rounded-md bg-card">
      {links.map((l, i) => {
        const s = nodes.find((n) => n.id === l.source)!;
        const t = nodes.find((n) => n.id === l.target)!;
        return <line key={i} x1={s.x} y1={s.y} x2={t.x} y2={t.y} stroke="hsl(var(--muted-foreground))" strokeWidth={1} />;
      })}
      {nodes.map((n) => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r={10} fill={n.group === "have" ? "hsl(var(--brand-from))" : "hsl(var(--destructive))"} />
          <text x={n.x + 14} y={n.y + 4} fontSize={12} fill="currentColor">{n.id}</text>
        </g>
      ))}
    </svg>
  );
}
