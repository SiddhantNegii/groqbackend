// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Groq } from 'groq-sdk';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    const chatStream = await groq.chat.completions.create({
      model: 'llama3-70b-8192',
      messages,
      stream: true,
    });

    res.setHeader('Content-Type', 'text/plain');

    for await (const chunk of chatStream) {
      res.write(chunk.choices[0]?.delta?.content || '');
    }

    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Groq API failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Groq backend running on http://localhost:${PORT}`));
