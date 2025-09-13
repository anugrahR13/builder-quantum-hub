import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ResumeTools({ resumeText, jobDescription }: { resumeText: string; jobDescription: string }) {
  const [ats, setAts] = useState<any>(null);
  const [enhanced, setEnhanced] = useState<string | null>(null);

  return (
    <Card className="p-4">
      <h3 className="font-semibold">AI Resume Tools</h3>
      <div className="mt-2 flex gap-2">
        <Button size="sm" variant="secondary" onClick={async () => {
          const r = await fetch('/api/resume/ats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resumeText, jobDescription })});
          setAts(await r.json());
        }}>ATS Check</Button>
        <Button size="sm" onClick={async () => {
          const r = await fetch('/api/resume/enhance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resumeText, jobDescription })});
          const j = await r.json();
          setEnhanced(j.improved || null);
        }}>Enhance</Button>
      </div>
      {ats && (
        <div className="mt-3 text-sm">
          <p>Score: {ats.score}% • Words: {ats.wordCount} • Coverage: {ats.coverage}%</p>
          {ats.suggestions?.length > 0 && <ul className="list-disc ml-4">{ats.suggestions.map((s: string, i: number) => <li key={i}>{s}</li>)}</ul>}
        </div>
      )}
      {enhanced && (
        <div className="mt-3 prose max-w-none" dangerouslySetInnerHTML={{ __html: enhanced.replace(/\n/g, '<br/>') }} />
      )}
    </Card>
  );
}
