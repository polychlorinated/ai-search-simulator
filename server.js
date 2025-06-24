/**
 * Minimal AI proxy for client to call a single AI model.
 *
 * Usage:
 *   npm install express cors openai
 *   export OPENAI_API_KEY="sk-..."
 *   node server.js
 */
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files (your SPA bundle)
app.use(express.static(__dirname));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Single endpoint to simulate ChatGPT, Google AI, and Perplexity responses
app.post('/api/ai-simulate', async (req, res) => {
  try {
    const { fullName, practiceName, city, state, services, presence } = req.body;
    const prompt = `
You are simulating three AI engines: [ChatGPT], [Google AI], and [Perplexity].
Based on this practice:

• Name: ${practiceName}
• Owner: ${fullName}
• Location: ${city}, ${state}
• Services: ${services.join(', ')}
• Online presence: ${presence.join(', ')}

Please output three labeled sections exactly like this:

[ChatGPT Response]
…ChatGPT style text…

[Google AI Response]
…Google AI style text…

[Perplexity Response]
…Perplexity style text…
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const text = completion.data.choices?.[0]?.message?.content || '';
    const parts = text.split(/\[ChatGPT Response\]|\[Google AI Response\]|\[Perplexity Response\]/).map(p => p.trim());
    res.json({
      chatgpt: parts[1] || '',
      google: parts[2] || '',
      perplexity: parts[3] || '',
    });
  } catch (err) {
    console.error('AI simulation error:', err);
    res.status(500).json({ error: 'AI simulation failed' });
  }
});

// Start the proxy server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`AI proxy listening at http://localhost:${port}`);
});