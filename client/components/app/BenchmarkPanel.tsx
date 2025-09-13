import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

export default function BenchmarkPanel() {
  const [data, setData] = useState<{ overall: { avg: number; count: number }; byTitle: { title: string; avg: number; count: number }[] } | null>(null);
  useEffect(() => {
    fetch("/api/benchmark").then((r) => r.json()).then(setData).catch(() => {});
  }, []);
  if (!data) return null;
  return (
    <Card className="p-4">
      <h3 className="font-semibold">Peer Benchmark</h3>
      <p className="text-sm text-muted-foreground">Overall avg fit: {data.overall.avg}% across {data.overall.count} reports</p>
      <ul className="mt-3 space-y-1 text-sm">
        {data.byTitle.slice(0, 6).map((x) => (
          <li key={x.title} className="flex justify-between"><span>{x.title}</span><span className="text-muted-foreground">{x.avg}%</span></li>
        ))}
      </ul>
    </Card>
  );
}
