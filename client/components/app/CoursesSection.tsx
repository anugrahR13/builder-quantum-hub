import { Card } from "@/components/ui/card";

function isPaid(url: string, provider: string) {
  const u = url.toLowerCase();
  const p = provider.toLowerCase();
  return /udemy|coursera|udacity|pluralsight|datacamp|educative/.test(u) || /udemy|coursera|udacity|pluralsight|datacamp|educative/.test(p);
}

export default function CoursesSection({ items }: { items: { title: string; url: string; provider: string; type: string }[] }) {
  const free = items.filter((i) => !isPaid(i.url, i.provider));
  const paid = items.filter((i) => isPaid(i.url, i.provider));
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-4">
        <h3 className="font-semibold">Free courses</h3>
        <ul className="mt-2 grid gap-2">
          {free.slice(0, 8).map((r) => (
            <li key={r.url} className="rounded border p-2 bg-card">
              <a className="font-medium underline underline-offset-4" href={r.url} target="_blank" rel="noreferrer">{r.title}</a>
              <p className="text-xs text-muted-foreground">{r.provider} • {r.type}</p>
            </li>
          ))}
          {free.length === 0 && <p className="text-sm text-muted-foreground">No free courses detected.</p>}
        </ul>
      </Card>
      <Card className="p-4">
        <h3 className="font-semibold">Paid courses</h3>
        <ul className="mt-2 grid gap-2">
          {paid.slice(0, 8).map((r) => (
            <li key={r.url} className="rounded border p-2 bg-card">
              <a className="font-medium underline underline-offset-4" href={r.url} target="_blank" rel="noreferrer">{r.title}</a>
              <p className="text-xs text-muted-foreground">{r.provider} • {r.type}</p>
            </li>
          ))}
          {paid.length === 0 && <p className="text-sm text-muted-foreground">No paid courses detected.</p>}
        </ul>
      </Card>
    </div>
  );
}
