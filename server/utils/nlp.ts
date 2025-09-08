import { SKILL_VOCABULARY } from "./skills";

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\-\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenize(text: string): string[] {
  return normalize(text).split(" ").filter(Boolean);
}

export function extractSkills(text: string): string[] {
  const norm = normalize(text);
  const found = new Set<string>();
  for (const term of SKILL_VOCABULARY) {
    const t = term.toLowerCase();
    const pat = new RegExp(`(^|[^a-z0-9])${escapeRegExp(t)}([^a-z0-9]|$)`, "i");
    if (pat.test(norm)) found.add(t);
  }
  return Array.from(found);
}

export function vectorize(skillsUniverse: string[], present: string[]): number[] {
  const set = new Set(present.map((s) => s.toLowerCase()));
  return skillsUniverse.map((s) => (set.has(s.toLowerCase()) ? 1 : 0));
}

export function cosine(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const av = a[i] ?? 0;
    const bv = b[i] ?? 0;
    dot += av * bv;
    na += av * av;
    nb += bv * bv;
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
