require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Review schema (optional - example)
const reviewSchema = new mongoose.Schema({
  name: String,
  review: String
});
const Review = mongoose.model('Review', reviewSchema);

// Routes
app.get('/', (req, res) => {
  res.send('🎉 Server is running!');
});

// Get reviews
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Post a review
app.post('/api/reviews', async (req, res) => {
  const { name, review } = req.body;
  try {
    const newReview = new Review({ name, review });
    await newReview.save();
    res.status(201).json({ message: 'Review added!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save review' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
