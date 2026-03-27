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
      branch: "main",
      recursive: true,
      unknown: "warn",
      ignorePaths: ["node_modules", "package-lock.json", ".git", "dist", "build"],
    });

    const docs = await loader.load();
    console.log(`Fetched ${docs.length} files.`);

    // 2. Split Code into Chunks
    // We use a specific splitter for code to keep functions together
    const splitter = RecursiveCharacterTextSplitter.fromLanguage("js", {
      chunkSize: 2000,
      chunkOverlap: 200,
    });

    const splitDocs = await splitter.splitDocuments(docs);
    console.log(`Created ${splitDocs.length} code chunks.`);

    return splitDocs;
  } catch (error) {
    console.error("Error processing repo:", error);
  }
};