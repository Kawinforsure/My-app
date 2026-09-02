const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/humanize-advanced', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'No text provided' });

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert humanizer. Rewrite the text to sound completely natural, varying sentence lengths, using natural flow, and removing AI buzzwords while keeping the original meaning intact.'
        },
        { role: 'user', content: text }
      ],
      model: 'llama3-8b-8192',
    });

    const humanizedText = completion.choices[0]?.message?.content || text;
    res.json({ humanized_text: humanizedText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error processing text' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
