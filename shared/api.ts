/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

export interface AnalyzeResponse {
  fitScore: number;
  missingSkills: string[];
  matchedSkills: string[];
  candidateSkills: string[];
  requiredSkills: string[];
  universe: string[];
  vectors: { candidate: number[]; required: number[] };
  recommendations: { title: string; url: string; provider: string; type: "course"|"project"|"certification" }[];
  semanticScore?: number; // Optional cosine similarity using embeddings when OPENAI_API_KEY is set
  suggestions?: { title: string; description: string; score: number; matched: string[]; missing: string[] }[];
}

export interface ReportsListResponse {
  items: Array<{
    _id?: string;
    createdAt: string;
    jobTitle?: string;
    fitScore: number;
    missingSkills: string[];
    matchedSkills: string[];
    candidateSkills: string[];
    requiredSkills: string[];
  }>;
}
