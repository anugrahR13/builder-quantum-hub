import { useEffect, useState } from "react";
import type { ReportsListResponse } from "@shared/api";

export default function Reports() {
  const [items, setItems] = useState<ReportsListResponse["items"]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/reports");
        const data = (await res.json()) as ReportsListResponse;
        setItems(data.items.map((d) => ({ ...d, createdAt: d.createdAt })));
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Saved Reports</h1>
      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : items.length === 0 ? (
        <div className="rounded-lg border p-6 bg-card">
          <p className="text-muted-foreground">No reports yet. Run an analysis from the Home page.</p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, idx) => (
            <li key={(it._id || idx.toString()) + it.createdAt} className="rounded-lg border p-4 bg-card">
              <p className="text-sm text-muted-foreground">{new Date(it.createdAt).toLocaleString()}</p>
              <h3 className="font-semibold mt-1">{it.jobTitle || "Job"}</h3>
              <p className="mt-2"><span className="font-semibold">Fit Score:</span> {it.fitScore}%</p>
              <p className="mt-2 text-sm"><span className="font-semibold">Missing:</span> {it.missingSkills.slice(0,6).join(", ") || "None"}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
