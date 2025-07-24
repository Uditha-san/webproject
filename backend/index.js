const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/hotel_reviews', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Define schema
const reviewSchema = new mongoose.Schema({
  text: String,
  date: { type: Date, default: Date.now }
});
const Review = mongoose.model('Review', reviewSchema);

// POST endpoint to save reviews
app.post('/api/reviews', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Review text is required' });
  }

  try {
    const review = new Review({ text });
    await review.save();
    res.json({ message: '✅ Review saved successfully!' });
  } catch (err) {
    console.error('❌ Error saving review:', err);
    res.status(500).json({ error: 'Failed to save review' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
