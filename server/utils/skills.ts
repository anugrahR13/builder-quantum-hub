export const SKILL_VOCABULARY: string[] = [
  // Programming languages
  "python","javascript","typescript","java","c++","c#","go","rust","ruby","r","sql",
  // Web / Frontend
  "html","css","sass","less","tailwind","bootstrap","react","reactjs","next.js","redux","vue","angular","vite","webpack",
  // Backend / Web
  "node.js","node","express","expressjs","fastapi","flask","graphql","rest api","nestjs","django","spring boot",
  // Data science / ML core
  "machine learning","deep learning","nlp","computer vision","data analysis","statistics",
  // Python DS stack
  "numpy","pandas","scikit-learn","matplotlib","seaborn","tensorflow","tf","pytorch","keras","xgboost",
  // NLP stack
  "spacy","nltk","transformers","hugging face","gensim","sentence transformers",
  // Databases
  "mongodb","postgresql","postgres","mysql","sqlite","firebase","dynamodb","redis","elasticsearch",
  // Cloud
  "aws","gcp","azure","sagemaker","bigquery","databricks",
  // DevOps / tools
  "git","docker","kubernetes","linux","bash","jira","github","gitlab","bitbucket","jenkins","github actions","ci/cd",
  // Testing / tooling
  "jest","vitest","cypress","playwright","storybook",
];

export type Resource = { title: string; url: string; provider: string; type: "course"|"project"|"certification" };

const RESOURCES: Record<string, Resource[]> = {
  python: [
    { title: "Python for Everybody", url: "https://www.py4e.com/", provider: "University of Michigan", type: "course" },
    { title: "Automate the Boring Stuff", url: "https://automatetheboringstuff.com/", provider: "Al Sweigart", type: "course" },
  ],
  "machine learning": [
    { title: "Machine Learning Specialization", url: "https://www.coursera.org/specializations/machine-learning-introduction", provider: "DeepLearning.AI", type: "course" },
    { title: "scikit-learn tutorials", url: "https://scikit-learn.org/stable/tutorial/index.html", provider: "scikit-learn", type: "course" },
  ],
  pandas: [
    { title: "Pandas in 10 Minutes", url: "https://pandas.pydata.org/pandas-docs/stable/user_guide/10min.html", provider: "pandas", type: "course" },
    { title: "Pandas Exercises", url: "https://github.com/guipsamora/pandas_exercises", provider: "GitHub", type: "project" },
  ],
  tensorflow: [
    { title: "TensorFlow Tutorials", url: "https://www.tensorflow.org/tutorials", provider: "TensorFlow", type: "course" },
  ],
  pytorch: [
    { title: "Deep Learning with PyTorch", url: "https://pytorch.org/tutorials/", provider: "PyTorch", type: "course" },
  ],
  spacy: [
    { title: "spaCy Course", url: "https://course.spacy.io/", provider: "Explosion", type: "course" },
  ],
  nltk: [
    { title: "NLTK Book", url: "https://www.nltk.org/book/", provider: "NLTK", type: "course" },
  ],
  "hugging face": [
    { title: "Hugging Face Course", url: "https://huggingface.co/learn/nlp-course", provider: "Hugging Face", type: "course" },
    { title: "Transformers Docs", url: "https://huggingface.co/docs/transformers/index", provider: "Hugging Face", type: "course" },
  ],
  docker: [
    { title: "Docker Getting Started", url: "https://docs.docker.com/get-started/", provider: "Docker", type: "course" },
  ],
  kubernetes: [
    { title: "Kubernetes Basics", url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/", provider: "Kubernetes", type: "course" },
  ],
  mongodb: [
    { title: "MongoDB University Basics", url: "https://learn.mongodb.com/learning-paths/basics", provider: "MongoDB", type: "course" },
  ],
  aws: [
    { title: "AWS Skill Builder", url: "https://explore.skillbuilder.aws/learn", provider: "AWS", type: "course" },
    { title: "AWS Cloud Practitioner", url: "https://www.aws.training/Details/Video?id=15885", provider: "AWS", type: "certification" },
  ],
  react: [
    { title: "React Beta Docs", url: "https://react.dev/learn", provider: "Meta", type: "course" },
  ],
  sql: [
    { title: "SQL Murder Mystery", url: "https://mystery.knightlab.com/", provider: "Knight Lab", type: "project" },
    { title: "Mode SQL Tutorial", url: "https://mode.com/sql-tutorial/", provider: "Mode", type: "course" },
  ],
};

export function recommendResources(skills: string[]): Resource[] {
  const seen = new Set<string>();
  const out: Resource[] = [];
  for (const s of skills) {
    const key = s.toLowerCase();
    const items = RESOURCES[key];
    if (!items) continue;
    for (const r of items) {
      const sig = `${r.title}|${r.url}`;
      if (seen.has(sig)) continue;
      seen.add(sig);
      out.push(r);
    }
  }
  return out.slice(0, 12);
}
