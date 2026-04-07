import { GoogleGenerativeAI, TaskType } from "@google/generative-ai";
import { Pinecone } from "@pinecone-database/pinecone";
import "dotenv/config";

const MODEL_NAME = "models/gemini-embedding-001";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pc.Index("repo-mind");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const saveToVectorStore = async (docs, namespace) => {
  try {
    if (!Array.isArray(docs) || docs.length === 0) return;

    const vectors = [];
    console.log(`Starting embedding for ${docs.length} chunks...`);

    for (let i = 0; i < docs.length; i++) {
      await sleep(1000);

      try {
        const result = await model.embedContent({
          content: { parts: [{ text: docs[i].pageContent }] },
          taskType: TaskType.RETRIEVAL_DOCUMENT,
          outputDimensionality: 768,
        });

        const values = result.embedding.values;
        vectors.push({
          id: `vec_${Date.now()}_${i}`,
          values,
          metadata: {
            text: docs[i].pageContent,
            source: docs[i].metadata.source,
          },
        });

        if (i % 5 === 0) console.log(`Progress: ${i}/${docs.length}`);
      } catch (err) {
        console.error(`Chunk ${i} failed:`, err.message);
        console.log("Retrying in 5 seconds...");
        await sleep(5000);
        i--;
      }
    }

    console.log(`Generated ${vectors.length} vectors. Pushing to Pinecone...`);
    const BATCH_SIZE = 50;

    for (let i = 0; i < vectors.length; i += BATCH_SIZE) {
      const batch = vectors.slice(i, i + BATCH_SIZE);

      if (batch.length > 0) {
        try {
          await index.namespace(namespace).upsert(batch);
          console.log(`Successfully pushed batch ${Math.floor(i / BATCH_SIZE) + 1}`);
        } catch (pineconeErr) {
          console.error("Pinecone Upsert Error:", pineconeErr.message);
        }
      }
    }

    console.log("SUCCESS: RepoMind indexed!");
  } catch (error) {
    console.error("Final Sync Error:", error.message);
  }
};
