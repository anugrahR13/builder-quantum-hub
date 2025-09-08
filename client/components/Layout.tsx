import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function Layout() {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[hsl(var(--secondary))] via-[hsl(var(--background))] to-[hsl(var(--muted))]">
      <header className="sticky top-0 z-40 border-b bg-gradient-to-r from-[hsl(var(--brand-from))]/10 via-transparent to-[hsl(var(--brand-to))]/10 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[hsl(var(--brand-from))] via-[hsl(var(--brand-via))] to-[hsl(var(--brand-to))]" />
            <span className="font-extrabold tracking-tight text-lg">Career Path & Skill Gap Analyzer</span>
          </Link>
          <nav className="flex items-center gap-2">
            <NavLink to="/" active={pathname === "/"}>Home</NavLink>
            <NavLink to="/reports" active={pathname.startsWith("/reports")}>Reports</NavLink>
            <Button asChild size="sm" className="ml-2 bg-gradient-to-r from-[hsl(var(--brand-from))] via-[hsl(var(--brand-via))] to-[hsl(var(--brand-to))] text-primary-foreground">
              <a href="#get-started">Get Started</a>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t">
        <div className="container py-6 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-2">
          <p>Built with React + Express. Optional MongoDB via MONGODB_URI.</p>
          <p>
            <a className="underline-offset-4 hover:underline" href="#privacy">Privacy</a>
            <span className="mx-2">•</span>
            <a className="underline-offset-4 hover:underline" href="#terms">Terms</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ to, children, active }: { to: string; children: React.ReactNode; active: boolean }) {
  return (
    <Link
      to={to}
      className={cn(
        "px-3 py-2 rounded-md text-sm font-medium transition-colors",
        active ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"
      )}
    >
      {children}
    </Link>
  );
}
