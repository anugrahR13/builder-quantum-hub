import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;
let client: MongoClient | null = null;

export async function getClient(): Promise<MongoClient | null> {
  if (!uri) return null;
  if (client) return client;
  client = new MongoClient(uri, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
  });
  await client.connect();
  return client;
}

export type AnalysisDoc = {
  _id?: string;
  createdAt: Date;
  jobTitle?: string;
  fitScore: number;
  missingSkills: string[];
  matchedSkills: string[];
  candidateSkills: string[];
  requiredSkills: string[];
};

const memory: AnalysisDoc[] = [];

export async function saveAnalysis(doc: AnalysisDoc) {
  const c = await getClient();
  if (!c) {
    memory.unshift({ ...doc, _id: Math.random().toString(36).slice(2) });
    return;
  }
  const db = c.db();
  await db.collection<AnalysisDoc>("analyses").insertOne(doc);
}

export async function listAnalyses(limit = 20): Promise<AnalysisDoc[]> {
  const c = await getClient();
  if (!c) return memory.slice(0, limit);
  const db = c.db();
  const docs = await db
    .collection<AnalysisDoc>("analyses")
    .find({}, { sort: { createdAt: -1 } })
    .limit(limit)
    .toArray();
  return docs as any;
}
