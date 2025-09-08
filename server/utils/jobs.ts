import { vectorize, cosine } from "./nlp";

export type JobRole = {
  title: string;
  tags: string[]; // representative skills/keywords
  description: string;
};

export const JOB_ROLES: JobRole[] = [
  { title: "Data Scientist", tags: ["python","pandas","numpy","machine learning","statistics","scikit-learn","sql","tensorflow","pytorch"], description: "Analyze data, build ML models, and communicate insights." },
  { title: "Machine Learning Engineer", tags: ["python","pytorch","tensorflow","mlops","docker","kubernetes","aws","gcp","mlflow","airflow"], description: "Productionize ML models and build scalable pipelines." },
  { title: "Data Analyst", tags: ["sql","excel","power bi","tableau","pandas","statistics","data analysis"], description: "Transform data into dashboards and reports." },
  { title: "NLP Engineer", tags: ["nlp","spacy","nltk","transformers","hugging face","python","pytorch"], description: "Build language models and text-processing systems." },
  { title: "Computer Vision Engineer", tags: ["computer vision","opencv","pytorch","tensorflow","python"], description: "Design and deploy image/video understanding models." },
  { title: "Full-Stack Developer", tags: ["react","node.js","express","typescript","sql","mongodb","docker"], description: "Develop end-to-end web applications." },
  { title: "Backend Developer", tags: ["node.js","express","sql","mongodb","docker","aws","rest api","graphql"], description: "Build and maintain server-side services and APIs." },
  { title: "Data Engineer", tags: ["python","sql","airflow","aws","gcp","spark","docker","kubernetes"], description: "Build data pipelines and infrastructure for analytics." },
];

export function suggestJobs(candidateSkills: string[], domainHint?: string) {
  const universe = buildUniverse(candidateSkills);
  const candVec = vectorize(universe, candidateSkills);

  const scored = JOB_ROLES.map((role) => {
    const roleVec = vectorize(universe, normalize(role.tags));
    const score = cosine(candVec, roleVec);
    const matched = normalize(role.tags).filter((t) => candidateSkills.includes(t));
    const missing = normalize(role.tags).filter((t) => !candidateSkills.includes(t));
    return { role, score, matched, missing };
  });

  // Prefer roles matching the domain hint words if supplied
  const hint = (domainHint || "").toLowerCase();
  scored.sort((a, b) => {
    const ha = hint && a.role.title.toLowerCase().includes(hint) ? 0.05 : 0;
    const hb = hint && b.role.title.toLowerCase().includes(hint) ? 0.05 : 0;
    return b.score + hb - (a.score + ha);
  });

  return scored.slice(0, 5).map((s) => ({
    title: s.role.title,
    description: s.role.description,
    score: Math.round(s.score * 100),
    matched: s.matched,
    missing: s.missing.slice(0, 4),
  }));
}

function buildUniverse(candidate: string[]): string[] {
  const set = new Set<string>(candidate.map((c) => c.toLowerCase()));
  for (const role of JOB_ROLES) for (const t of role.tags) set.add(t.toLowerCase());
  return Array.from(set);
}

function normalize(arr: string[]): string[] {
  return Array.from(new Set(arr.map((a) => a.toLowerCase())));
}
