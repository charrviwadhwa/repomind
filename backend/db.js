import { GoogleGenerativeAI, TaskType } from "@google/generative-ai";
import { Pinecone } from "@pinecone-database/pinecone";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pc.Index("repo-mind");

export const saveToVectorStore = async (docs) => {
  try {
    if (!Array.isArray(docs) || docs.length === 0) {
      console.log("No documents received for vector sync.");
      return;
    }

    const vectors = [];
    console.log(`Debugging ${docs.length} chunks...`);

    for (const [i, doc] of docs.entries()) {
      console.log(`--- Chunk ${i} Start ---`);

      const result = await model.embedContent({
        content: { parts: [{ text: doc?.pageContent ?? "" }] },
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        outputDimensionality: 3072,
      });

      console.dir(result, { depth: null });

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
        console.log(`Chunk ${i} embedded successfully.`);
      } else {
        console.log(`Chunk ${i} failed to generate values.`);
      }
    }

    console.log(`Final Vector Array Count: ${vectors.length}`);

    if (vectors.length === 0) {
      throw new Error("No valid vectors were generated, skipping Pinecone upsert.");
    }

    console.log("Pushing to Pinecone...");

    // Pinecone SDK v7 expects an object: { records: [...] }
    const upsertResponse = await index.upsert({ records: vectors });

    console.log("Pinecone Response:", upsertResponse);
    console.log("SUCCESS!");
  } catch (error) {
    console.error("Sync Error:", error);
    throw error;
  }
};
