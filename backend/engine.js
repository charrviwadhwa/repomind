import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import "dotenv/config";

// 🚀 ADDED 'branch' parameter here with a default value
export const processRepository = async (repoUrl, branch = "main") => {
  try {
    console.log(`--- Loading Repository: ${repoUrl} (Branch: ${branch}) ---`);
    
    const loader = new GithubRepoLoader(repoUrl, {
      accessToken: process.env.GITHUB_TOKEN,
      branch: branch, // ✅ Now 'branch' is defined!
      recursive: true,
      unknown: "warn",
      ignorePaths: [
        "node_modules", "package-lock.json", "yarn.lock", "pnpm-lock.yaml",
        ".git", ".github", ".vscode", "dist", "build", "out",
        "*.png", "*.jpg", "*.jpeg", "*.gif", "*.svg", "*.ico",
        "*.pdf", "*.zip", "*.tar.gz", "*.map",
        "coverage", ".next", ".expo"
      ],
    });

    const docs = await loader.load();
    
    if (docs.length === 0) {
        console.warn("⚠️ No files found. Double-check the branch name.");
        return [];
    }

    console.log(`Fetched ${docs.length} files.`);

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const splitDocs = await splitter.splitDocuments(docs);
    console.log(`Created ${splitDocs.length} code chunks.`);

    return splitDocs;
  } catch (error) {
    console.error("Error processing repo:", error.message);
    throw error; // Re-throw so index.js can catch it
  }
};