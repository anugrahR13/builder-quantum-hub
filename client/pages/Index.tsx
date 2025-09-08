import UploadForm from "@/components/app/UploadForm";

export default function Index() {
  return (
    <div>
      <section className="container py-16" id="get-started">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Career Path & Skill Gap Analyzer
            </h1>
            <p className="mt-4 text-muted-foreground text-lg">
              Upload your resume, paste a job description, and get an AI-powered Skill Gap Report, personalized learning path, and Job Fit Score.
            </p>
            <ul className="mt-6 grid gap-3">
              <li className="flex items-start gap-3"><span className="h-6 w-6 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-bold">1</span><span>Parse resume and job description (PDF/DOCX supported)</span></li>
              <li className="flex items-start gap-3"><span className="h-6 w-6 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-bold">2</span><span>Semantic matching with cosine similarity</span></li>
              <li className="flex items-start gap-3"><span className="h-6 w-6 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-bold">3</span><span>Visual dashboard + recommended courses/projects</span></li>
            </ul>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-[hsl(var(--brand-from))]/25 via-[hsl(var(--brand-via))]/20 to-[hsl(var(--brand-to))]/25 blur-2xl rounded-3xl" />
            <div className="relative rounded-2xl border bg-card p-6 shadow-lg">
              <p className="text-sm text-muted-foreground">Example output</p>
              <div className="mt-2 flex items-end justify-between">
                <p className="text-5xl font-extrabold">86%</p>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Missing</p>
                  <p className="font-medium">Docker, TensorFlow</p>
                </div>
              </div>
              <div className="mt-4 h-2 rounded bg-muted overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[hsl(var(--brand-from))] via-[hsl(var(--brand-via))] to-[hsl(var(--brand-to))] animated-gradient" style={{ width: "86%" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12">
        <UploadForm />
      </section>
    </div>
  );
}
