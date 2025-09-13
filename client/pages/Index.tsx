import UploadForm from "@/components/app/UploadForm";
import JobTicker from "@/components/app/JobTicker";
import ChatWidget from "@/components/app/ChatWidget";

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
              Upload your resume, paste a job description, and get an AI-powered
              Skill Gap Report, personalized learning path, and Job Fit Score.
            </p>
            <ul className="mt-6 grid gap-3">
              <li className="flex items-start gap-3">
                <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-bold">
                  1
                </span>
                <span>
                  Parse resume and job description (PDF/DOCX supported)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-bold">
                  2
                </span>
                <span>Semantic matching with cosine similarity</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-bold">
                  3
                </span>
                <span>Visual dashboard + recommended courses/projects</span>
              </li>
            </ul>
          </div>
          <div className="relative">
            <div className="absolute -inset-8 bg-gradient-to-tr from-[hsl(var(--brand-from))]/20 via-[hsl(var(--brand-via))]/15 to-[hsl(var(--brand-to))]/20 blur-3xl rounded-3xl" />
            <div className="relative h-56 rounded-2xl border bg-card/60 backdrop-blur-sm flex items-center justify-center glow-card">
              <p className="text-sm text-muted-foreground">
                Run an analysis below to see your personalized dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <UploadForm />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Job market trends</h3>
            <JobTicker />
          </div>
        </div>
        <ChatWidget />
      </section>
    </div>
  );
}
