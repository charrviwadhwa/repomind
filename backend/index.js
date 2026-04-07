import express from "express";
import cors from "cors";
import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAI, TaskType } from "@google/generative-ai";
import { processRepository } from "./engine.js";
import { saveToVectorStore } from "./db.js";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());
console.log("DEBUG: API Key ends with:", process.env.GOOGLE_API_KEY.slice(-4));
const chatModel = [
  process.env.GEMINI_CHAT_MODEL,
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
].filter(Boolean);

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pc.Index("repo-mind");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

app.get("/", (req, res) => res.send("Server is alive!"));

app.post("/ask", async (req, res) => {
  const { question, namespace } = req.body;

  try {
    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "A valid question is required." });
    }

    
    const lowerQ = question.toLowerCase().trim();
    if (["hi", "hello", "hey"].includes(lowerQ)) {
      return res.json({ answer: "Hello! I'm RepoMind. I can help you understand this codebase. What would you like to know?" });
    }

    
    const embResult = await embeddingModel.embedContent({
      content: { parts: [{ text: question }] },
      taskType: TaskType.RETRIEVAL_QUERY,
      outputDimensionality: 768,
    });
    const queryVector = embResult?.embedding?.values;


    const queryResponse = await index.namespace(namespace || "").query({
      vector: queryVector,
      topK: 7,
      includeMetadata: true,
    });

    const matches = queryResponse?.matches ?? [];
    const context = matches.map((m) => m.metadata?.text).join("\n\n");

    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `Use the following code context to answer the question.
    CONTEXT: ${context}
    QUESTION: ${question}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ 
      answer: text,
      sources: matches.map(m => m.metadata?.fileName).filter(Boolean)
    });

  } catch (error) {
    console.error("Ask Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/ingest", async (req, res) => {
  const { repoUrl, branch = "main" } = req.body;

  const namespace = repoUrl
    .split("github.com/")[1]
    .replace(/\//g, "-")
    .toLowerCase();

  const tempDir = path.join(process.cwd(), "temp", `repo-${Date.now()}`);

  try {
    if (!repoUrl) return res.status(400).json({ error: "No URL provided." });

    const stats = await index.describeIndexStats();
    if (stats.namespaces && stats.namespaces[namespace]) {
      console.log(`Repo ${namespace} already exists. Skipping ingestion.`);
      return res.json({
        message: "Repository already indexed!",
        namespace,
        alreadyExists: true,
      });
    }

    console.log(`Ingesting new repo: ${namespace}`);

    execSync(`git clone --branch ${branch} --depth 1 "${repoUrl}" "${tempDir}"`, { stdio: "inherit" });

    const documents = await processRepository(tempDir);

    if (!documents || documents.length === 0) {
      fs.rmSync(tempDir, { recursive: true, force: true });
      return res.status(400).json({ error: "No code files found." });
    }

    await saveToVectorStore(documents, namespace);

    fs.rmSync(tempDir, { recursive: true, force: true });

    res.json({
      message: "Repo Mind updated!",
      namespace,
      count: documents.length,
    });
  } catch (error) {
    if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
    console.error("Ingest Error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Server listening on http://127.0.0.1:${PORT}`);
});
