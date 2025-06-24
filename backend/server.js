import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: ['https://your-vercel-url.vercel.app'],
  methods: ['POST'],
  credentials: false
}));
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const positiveWords = ['good', 'great', 'amazing', 'excellent', 'fantastic', 'wonderful'];
const negativeWords = ['bad', 'terrible', 'poor', 'awful', 'boring', 'worst'];

const analyzeSentiment = (text) => {
  const words = text.toLowerCase().split(/\s+/);
  let posCount = 0;
  let negCount = 0;

  words.forEach((word) => {
    if (positiveWords.includes(word)) posCount++;
    if (negativeWords.includes(word)) negCount++;
  });

  let sentiment = '';
  let explanation = '';

  if (posCount > negCount) {
    sentiment = 'Positive';
    explanation = 'The review contains more Positive expressions.';
  } else if (negCount > posCount) {
    sentiment = 'Negative';
    explanation = 'The review contains more Negative expressions.';
  } else if (negCount === posCount) {
    sentiment = 'Neutral';
    explanation = 'The review has a Balanced Tone.';
  }

  return { sentiment, explanation };
};

app.post('/api/analyze', async (req, res) => {
  const { review, movie } = req.body;
  const { sentiment, explanation } = analyzeSentiment(review);
  const timestamp = new Date();

  try {
    await pool.query(
      'INSERT INTO reviews (text, sentiment, created_at) VALUES ($1, $2, $3)',
      [review, sentiment, timestamp]
    );
    res.json({ sentiment, explanation });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error analyzing sentiment');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
