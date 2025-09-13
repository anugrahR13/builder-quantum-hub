import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

export default function MentorPanel({ missing, matched }: { missing: string[]; matched: string[] }) {
  const [items, setItems] = useState<{ name: string; strength: number; canHelpWith: string[] }[]>([]);
  useEffect(() => {
    fetch("/api/mentors/suggest", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ missing, matched })})
      .then((r) => r.json())
      .then((d) => setItems(d.suggestions || []))
      .catch(() => {});
  }, [missing, matched]);
  if (!items.length) return null;
  return (
    <Card className="p-4">
      <h3 className="font-semibold">Mentor Matching</h3>
      <ul className="mt-2 space-y-2 text-sm">
        {items.map((m, i) => (
          <li key={i} className="rounded border p-2">
            <div className="flex items-center justify-between"><span>{m.name}</span><span className="text-muted-foreground">{m.strength}</span></div>
            {m.canHelpWith?.length > 0 && <p className="text-xs">Can help with: {m.canHelpWith.slice(0,5).join(', ')}</p>}
          </li>
        ))}
      </ul>
    </Card>
  );
}
