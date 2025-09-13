import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function GamificationPanel({ email = "guest" }: { email?: string }) {
  const [data, setData] = useState<{ email: string; xp: number; days: string[]; updatedAt: string } | null>(null);
  const refresh = async () => {
    try {
      const r = await fetch(`/api/progress?email=${encodeURIComponent(email)}`);
      setData(await r.json());
    } catch {}
  };
  useEffect(() => { refresh(); }, [email]);
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Gamification</h3>
        <Button size="sm" variant="secondary" onClick={refresh}>Refresh</Button>
      </div>
      <p className="text-sm text-muted-foreground mt-1">XP: {data?.xp ?? 0}</p>
      <p className="text-sm">Streak days: {data?.days?.length ?? 0}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {(data?.days || []).slice(-14).map((d) => (
          <span key={d} className="h-3 w-3 rounded-sm" title={d} style={{ background: "hsl(var(--brand-from))" }} />
        ))}
      </div>
    </Card>
  );
}
