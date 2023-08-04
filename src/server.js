import path from "node:path";
import { fileURLToPath } from "node:url";
import { Configuration, OpenAIApi } from 'openai';
import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAIKEY,
});

const openai = new OpenAIApi(configuration);
const PORT = process.env.SERVERPORT || 8080
const publicDirectoryPath = path.join(__dirname, "../public/dist")


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(publicDirectoryPath))

app.post('/generate', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const aiResponse = await openai.createImage({
      prompt,
      n: 1,
      size: '512x512',
    });

    const image = aiResponse.data.data[0].url;
    res.send({ image });
  } catch (error) {
    console.error(error)
    res.status(500).send(error?.response.data.error.message || 'Something went wrong');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
