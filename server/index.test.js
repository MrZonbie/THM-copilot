import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import app from './index.js';

describe('POST /api/chat', () => {
  beforeEach(() => {
    // Reset env vars before each test
    delete process.env.AI_PROVIDER;
    delete process.env.OPENAI_API_KEY;
    delete process.env.GEMINI_API_KEY;
    delete process.env.MODEL_NAME;
  });

  it('should return 400 if messages array is missing', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Messages array is required.' });
  });

  it('should return 500 if provider is openai but key is missing', async () => {
    process.env.AI_PROVIDER = 'openai';
    const res = await request(app)
      .post('/api/chat')
      .send({ messages: [{ role: 'user', content: 'test' }] });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'OpenAI API key not configured. Please configure it in the .env file.' });
  });

  it('should return 500 if provider is gemini but key is missing', async () => {
    process.env.AI_PROVIDER = 'gemini';
    const res = await request(app)
      .post('/api/chat')
      .send({ messages: [{ role: 'user', content: 'test' }] });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Gemini API key not configured. Please configure it in the .env file.' });
  });

  it('should return 500 and format error details correctly when API call fails', async () => {
    process.env.AI_PROVIDER = 'gemini';
    process.env.GEMINI_API_KEY = 'invalid_key';

    // We send a request to Google API with an invalid key, expecting a 400 Bad Request error from them
    const res = await request(app)
      .post('/api/chat')
      .send({ messages: [{ role: 'user', content: 'test' }] });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('An error occurred while processing your request with the AI provider.');
    expect(res.body.details).toContain('API key not valid'); // Ensure Google's error propagates
  }, 15000);
});
