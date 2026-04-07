import { DirectoryLoader } from "@langchain/classic/document_loaders/fs/directory";
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import "dotenv/config";

export const processRepository = async (localPath) => {
  try {
    console.log(`--- Scanning local codebase: ${localPath} ---`);

    const loader = new DirectoryLoader(
      localPath,
      {
        ".js": (path) => new TextLoader(path),
        ".jsx": (path) => new TextLoader(path),
        ".ts": (path) => new TextLoader(path),
        ".tsx": (path) => new TextLoader(path),
        ".py": (path) => new TextLoader(path),
        ".go": (path) => new TextLoader(path),
        ".java": (path) => new TextLoader(path),
        ".c": (path) => new TextLoader(path),
        ".cpp": (path) => new TextLoader(path),
        ".json": (path) => new TextLoader(path),
        ".md": (path) => new TextLoader(path),
        ".css": (path) => new TextLoader(path),
      },
      true
    );

    const docs = await loader.load();

    const filteredDocs = docs.filter(
      (doc) =>
        !doc.metadata.source.includes("node_modules") &&
        !doc.metadata.source.includes(".git") &&
        !doc.metadata.source.includes("package-lock.json")
    );

    if (filteredDocs.length === 0) {
      console.warn("No readable files found in the directory.");
      return [];
    }

    console.log(`Successfully read ${filteredDocs.length} files.`);

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const splitDocs = await splitter.splitDocuments(filteredDocs);
    console.log(`Created ${splitDocs.length} vector-ready code chunks.`);

    return splitDocs;
  } catch (error) {
    console.error("Engine Error:", error.message);
    throw error;
  }
};
