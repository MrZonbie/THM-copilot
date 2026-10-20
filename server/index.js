import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize Providers based on environment configuration
const provider = process.env.AI_PROVIDER || 'openai'; // 'openai' or 'gemini'
let openai;
let genAI;

if (provider === 'openai') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'dummy_key_for_build',
  });
} else if (provider === 'gemini') {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key_for_build');
}

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    if (provider === 'openai') {
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({
          error: 'OpenAI API key not configured. Please configure it in the .env file.'
        });
      }

      const response = await openai.chat.completions.create({
        model: process.env.MODEL_NAME || 'gpt-4o',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1500,
      });

      return res.json({ reply: response.choices[0].message.content });

    } else if (provider === 'gemini') {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          error: 'Gemini API key not configured. Please configure it in the .env file.'
        });
      }

      // Convert messages to Gemini format
      // Gemini expects a systemInstruction separately, and a specific history format
      const systemMessage = messages.find(m => m.role === 'system');
      const userHistory = messages.filter(m => m.role !== 'system');

      const model = genAI.getGenerativeModel({
        model: process.env.MODEL_NAME || 'gemini-1.5-pro',
        systemInstruction: systemMessage ? systemMessage.content : undefined,
      });

      const formattedHistory = userHistory.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

      // Extract the latest message
      const latestMessage = formattedHistory.pop();

      const chat = model.startChat({
        history: formattedHistory,
      });

      const result = await chat.sendMessage(latestMessage.parts[0].text);
      const responseText = result.response.text();

      return res.json({ reply: responseText });

    } else {
      return res.status(500).json({ error: 'Invalid AI_PROVIDER configured.' });
    }

  } catch (error) {
    console.error('Error calling AI API:', error);
    res.status(500).json({
      error: 'An error occurred while processing your request.',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port} using provider: ${provider}`);
});
