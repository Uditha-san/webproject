const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

// MongoDB Atlas URI
const MONGO_URI = 'mongodb+srv://akalankasenanayake88:gvvJYI3XkAQtLu3v@cluster0.nxpgjra.mongodb.net/landingpage?retryWrites=true&w=majority&appName=Cluster0';

// Middleware
app.use(cors());
app.use(express.json());

// Mongoose connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Schema
const reviewSchema = new mongoose.Schema({
  name: String,
  review: String
});

const Review = mongoose.model('Review', reviewSchema);

// API Routes
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const { name, review } = req.body;
    const newReview = new Review({ name, review });
    await newReview.save();
    res.status(201).json({ message: 'Review saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save review' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
