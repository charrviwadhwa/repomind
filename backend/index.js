import express from 'express';
import cors from 'cors';
import { processRepository } from './engine.js';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/ingest', async (req, res) => {
    const { repoUrl } = req.body;
    if (!repoUrl) return res.status(400).send("No URL provided");

    const documents = await processRepository(repoUrl);
    res.json({ message: "Repo loaded!", chunkCount: documents.length });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));