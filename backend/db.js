import { GoogleGenerativeAI, TaskType } from "@google/generative-ai";
import { Pinecone } from "@pinecone-database/pinecone";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pc.Index("repo-mind");

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const saveToVectorStore = async (docs) => {
  try {
    if (!Array.isArray(docs) || docs.length === 0) {
      console.log("No documents received for vector sync.");
      return;
    }

    const vectors = [];
    console.log(`🚀 Starting embedding for ${docs.length} chunks...`);

    // 1. Generate all embeddings first
    for (const [i, doc] of docs.entries()) {
        await sleep(500);
        try {
      const result = await model.embedContent({
        content: { parts: [{ text: doc?.pageContent ?? "" }] },
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        outputDimensionality: 3072,
      });

      const values = result?.embedding?.values;

      if (Array.isArray(values) && values.length > 0) {
        vectors.push({
          id: `vec_${Date.now()}_${i}`,
          values,
          metadata: {
            text: doc?.pageContent ?? "",
            source: doc?.metadata?.source ?? "unknown",
          },
        });
        if (i % 10 === 0) console.log(`✅ Embedded ${i} chunks...`);
      
    }
    }   catch{
        if (err.status === 429) {
                    console.log("⚠️ Rate limit hit! Sleeping for 5 seconds...");
                    await sleep(5000); // Wait longer if we hit a wall
                    i--; // Retry this same chunk
                } else {
                    console.error(`❌ Skip Chunk ${i}:`, err.message);
                }
            }
    }

    console.log(`✅ Generated ${vectors.length} vectors. Starting Pinecone push...`);

    // 2. BATCH UPSERT (The scaling fix)
    const BATCH_SIZE = 50; 
    for (let i = 0; i < vectors.length; i += BATCH_SIZE) {
        const batch = vectors.slice(i, i + BATCH_SIZE);
        
        // Pinecone v7 uses { records: [...] }
        await index.upsert({ records: batch });
        
        console.log(`Successfully pushed batch ${Math.floor(i / BATCH_SIZE) + 1}`);
    }

    console.log("🚀 SUCCESS: Large repo is now indexed!");
  } catch (error) {
    console.error("❌ Sync Error:", error);
    throw error;
  }
};