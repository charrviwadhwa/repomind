import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";

// 1. Initialize Gemini
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash", // Flash is faster/cheaper for summaries
  maxOutputTokens: 2048,
});

export const processRepository = async (repoUrl) => {
  try {
    console.log("--- Loading Repository ---");
    
    const loader = new GithubRepoLoader(repoUrl, {
  accessToken: process.env.GITHUB_TOKEN,
  branch: "master",
  recursive: true,
  unknown: "warn",
  // 🚀 Expanded ignore list for "Big Repos"
  ignorePaths: [
    "node_modules", "package-lock.json", "yarn.lock", "pnpm-lock.yaml",
    ".git", ".github", ".vscode", "dist", "build", "out",
    "*.png", "*.jpg", "*.jpeg", "*.gif", "*.svg", "*.ico", // No images!
    "*.pdf", "*.zip", "*.tar.gz", "*.map",
    "coverage", ".next", ".expo"
  ],
});

    const docs = await loader.load();
    console.log(`Fetched ${docs.length} files.`);

    // 2. Split Code into Chunks
    // We use a specific splitter for code to keep functions together
    // 💡 Change this to a general splitter if the repo is mixed-language
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1500, // Reduced slightly to keep Gemini context window "roomy"
  chunkOverlap: 200,
});

    const splitDocs = await splitter.splitDocuments(docs);
    console.log(`Created ${splitDocs.length} code chunks.`);

    return splitDocs;
  } catch (error) {
    console.error("Error processing repo:", error);
  }
};