import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';

// Ensure the .env file is loaded explicitly from the project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const provider = (process.env.AI_PROVIDER || 'openai').trim();

    // Secure diagnostic logs (do not log key content)
    console.log(`[Diagnostic] Loaded .env from: ${envPath}`);
    console.log(`[Diagnostic] AI_PROVIDER evaluated as: ${provider}`);
    console.log(`[Diagnostic] GEMINI_API_KEY present: ${!!process.env.GEMINI_API_KEY}`);
    console.log(`[Diagnostic] OPENAI_API_KEY present: ${!!process.env.OPENAI_API_KEY}`);

    if (provider === 'openai') {
      const openAiKey = process.env.OPENAI_API_KEY?.trim();
      if (!openAiKey) {
        return res.status(500).json({
          error: 'OpenAI API key not configured. Please configure it in the .env file.'
        });
      }

      const openai = new OpenAI({
        apiKey: openAiKey,
      });

      const response = await openai.chat.completions.create({
        model: (process.env.MODEL_NAME || 'gpt-4o').trim(),
        messages: messages,
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: "json_object" },
      });

      return res.json({ reply: response.choices[0].message.content });

    } else if (provider === 'gemini') {
      const geminiKey = process.env.GEMINI_API_KEY?.trim();
      if (!geminiKey) {
        return res.status(500).json({
          error: 'Gemini API key not configured. Please configure it in the .env file.'
        });
      }

      const genAI = new GoogleGenerativeAI(geminiKey);

      // Convert messages to Gemini format
      // Gemini expects a systemInstruction separately, and a specific history format
      const systemInstructions = messages.filter(m => m.role === 'system').map(m => m.content).join('\n\n');
      const userHistory = messages.filter(m => m.role !== 'system');

      const modelName = process.env.MODEL_NAME?.trim() || 'gemini-1.5-flash';
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemInstructions || undefined,
        generationConfig: {
          responseMimeType: "application/json"
        }
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

      const maxRetries = 3;
      let attempt = 0;
      let delay = 1000; // start with 1s delay

      while (attempt < maxRetries) {
        try {
          const result = await chat.sendMessage(latestMessage.parts[0].text);
          const responseText = result.response.text();
          return res.json({ reply: responseText });
        } catch (error) {
          const isRetryable = error.status === 503 || error.status === 429 || error.message?.includes('503') || error.message?.includes('429');
          attempt++;

          if (!isRetryable || attempt >= maxRetries) {
            throw error;
          }

          console.warn(`[Gemini Retry] Attempt ${attempt} failed with ${error.status || 'unknown status'}. Retrying model ${modelName} in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // exponential backoff
        }
      }

    } else {
      return res.status(500).json({ error: 'Invalid AI_PROVIDER configured.' });
    }

  } catch (error) {
    // Safely extract error details without logging full response objects or headers that might contain keys
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStatus = error.status || error.code || 'UNKNOWN';

    console.error(`[AI Provider Error] Status: ${errorStatus} | Message: ${errorMessage}`);

    // Do not leak secrets in the response, but provide the provider's message to the user
    res.status(500).json({
      error: 'An error occurred while processing your request with the AI provider.',
      details: errorMessage
    });
  }
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

export default app;
