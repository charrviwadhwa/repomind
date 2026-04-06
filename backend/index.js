import express from "express";
import cors from "cors";
import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAI, TaskType } from "@google/generative-ai";
import { processRepository } from "./engine.js";
import { saveToVectorStore } from "./db.js";


const app = express();
app.use(cors());
app.use(express.json());
console.log("🛠️ DEBUG: API Key ends with:", process.env.GOOGLE_API_KEY.slice(-4));
const CHAT_MODEL_CANDIDATES = [
  process.env.GEMINI_CHAT_MODEL,
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
].filter(Boolean);

app.get("/", (req, res) => res.send("Server is alive!"));

app.post("/ask", async (req, res) => {
  const { question } = req.body;

  try {
    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "A valid question is required." });
    }

    console.log(`Querying: ${question}`);

    // 1. Embed user query
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

    const result = await embeddingModel.embedContent({
      content: { parts: [{ text: question }] },
      taskType: TaskType.RETRIEVAL_QUERY,
      outputDimensionality: 768
    });

    const queryVector = result?.embedding?.values;
    if (!Array.isArray(queryVector) || queryVector.length === 0) {
      throw new Error("Failed to generate query embedding.");
    }

    // 2. Query Pinecone
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    const index = pc.Index("repo-mind");
    const queryResponse = await index.query({
      vector: queryVector,
      topK: 10,
      includeMetadata: true,
    });

    const matches = queryResponse?.matches ?? [];
    if (matches.length === 0) {
      return res.json({ answer: "I could not find relevant code in the vector store yet." });
    }

    // 3. Build context from metadata
    const context = matches
      .map((m) => m?.metadata?.text)
      .filter((text) => typeof text === "string" && text.trim().length > 0)
      .join("\n\n");

    if (!context) {
      return res.json({ answer: "I found related records, but they did not contain usable text context." });
    }

    const prompt = `You are a Senior Developer. Use ONLY the following code context to answer the question.\n\nContext:\n${context}\n\nQuestion: ${question}`;
    let response;
    let lastError;

    // 4. Generate answer using Gemini chat model with graceful model fallback
    for (const modelName of CHAT_MODEL_CANDIDATES) {
      try {
        const chatModel = new ChatGoogleGenerativeAI({
          model: modelName,
          apiKey: process.env.GOOGLE_API_KEY,
        });
        response = await chatModel.invoke(prompt);
        break;
      } catch (err) {
        lastError = err;
        console.warn(`Chat model ${modelName} failed, trying next model...`);
      }
    }

    if (!response) {
      throw lastError ?? new Error("Failed to generate answer with available chat models.");
    }

    const answerText =
      typeof response?.content === "string"
        ? response.content
        : Array.isArray(response?.content)
          ? response.content.map((p) => p?.text ?? "").join(" ").trim()
          : "No answer generated.";

    res.json({ answer: answerText || "No answer generated." });
  } catch (error) {
    console.error("Ask Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/ingest", async (req, res) => {
    // 🚀 Extract branch from req.body, defaulting to "main"
    const { repoUrl, branch = "main" } = req.body; 
    
    try {
        console.log(`📂 Ingesting: ${repoUrl} (Branch: ${branch})`);
        
        // Pass both repoUrl AND branch to your engine
        const documents = await processRepository(repoUrl, branch);

        if (!documents || documents.length === 0) {
            return res.status(400).json({ 
                error: "No documents were found. Check the Repo URL and Branch name." 
            });
        }

        console.log(`📄 Found ${documents.length} code chunks.`);
        await saveToVectorStore(documents); 

        res.json({ 
            message: "Repo Mind updated!", 
            count: documents.length,
            branch: branch 
        });
    } catch (error) {
        console.error("❌ Ingest Error:", error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3000;

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Server listening on http://127.0.0.1:${PORT}`);
});
