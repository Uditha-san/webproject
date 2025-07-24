import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showReview, setShowReview] = useState(false);
  const [reviews, setReviews] = useState([]); // reviews array state
  const [reviewText, setReviewText] = useState('');
  const [reviewName, setReviewName] = useState('');

  const cards = [
    {
      path: '/booking',
      title: 'Book Now',
      description: 'Reserve your stay in just a few steps.',
      extra: 'Select your dates, choose your preferred room, and enjoy a hassle-free booking experience.',
    },
    {
      path: '/my-bookings',
      title: 'My Bookings',
      description: 'View or cancel your current bookings easily in one place.',
      extra: 'Keep track of your reservations and modify them whenever necessary with ease.',
    },
    {
      path: '/offers',
      title: 'Offers',
      description: 'Explore seasonal discounts, special deals, and packages.',
      extra: 'Take advantage of our exclusive promotions and make your stay even more memorable.',
    },
    {
      path: '/contact',
      title: 'Contact Us',
      description: 'Reach out to us for assistance or inquiries anytime.',
      extra: 'Our friendly support team is available 24/7 to help you with your needs.',
    },
    {
      path: '/admin',
      title: 'Admin Panel',
      description: 'For staff only: manage rooms, users, and hotel settings.',
      extra: 'Securely administer hotel operations and ensure a smooth guest experience.',
    }
  ];

  // Fetch reviews from backend on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/reviews')
      .then(res => res.json())
      .then(data => {
        console.log("Fetched data:", data);
        if (Array.isArray(data)) {
          setReviews(data);
        } else if (Array.isArray(data.reviews)) {
          setReviews(data.reviews);
        } else {
          console.error("Invalid reviews format:", data);
          setReviews([]);
        }
      })
      .catch(err => {
        console.error("Failed to fetch reviews:", err);
        setReviews([]);
      });
  }, []);

  const handleCardClick = (path) => {
    navigate(path);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    const newReview = {
      name: reviewName.trim() || 'Anonymous',
      review: reviewText.trim()
    };

    if (!newReview.review) return; // Don't submit empty review

    try {
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      });

      if (response.ok) {
        setReviews(prev => [newReview, ...prev]); // add new review to list
        setReviewText('');
        setReviewName('');
        setShowReview(false);
        alert('Thank you for your feedback!');
      } else {
        alert('Failed to save review. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('Error submitting review.');
    }
  };

  const filteredCards = cards.filter(card =>
    card.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="landing-page">
      <h1>Welcome to DreamStay Hotel</h1>
      <p className="subheading">
        Book luxurious rooms, enjoy exclusive offers, and manage your bookings with ease.
      </p>

      <input
        type="text"
        className="search-bar"
        placeholder="Search for a section..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="card-container">
        {filteredCards.map((card, index) => (
          <div
            key={index}
            className="card"
            onClick={() => handleCardClick(card.path)}
          >
            <h2>{card.title}</h2>
            <p>{card.description}</p>
          </div>
        ))}
      </div>

      {/* About section */}
      <section className="about-us">
        <h2>About DreamStay Hotel</h2>
        <p>
          At DreamStay Hotel, we pride ourselves on providing an unforgettable guest experience. 
          From comfortable rooms to personalized services and exclusive offers, your satisfaction is our top priority. 
          Whether you are visiting for business or leisure, our dedicated team ensures your stay is relaxing and memorable.
        </p>
        <p>
          Explore our website to book rooms, check your bookings, or discover special promotions. 
          We look forward to welcoming you soon!
        </p>
      </section>

      {/* Leave a Review button */}
      <div className="review-button-container">
        {!showReview && (
          <button
            className="show-review-btn"
            onClick={() => setShowReview(true)}
          >
            Leave a Review
          </button>
        )}
      </div>

      {/* Review form */}
      {showReview && (
        <section className="review-us">
          <h2>Review Us</h2>
          <p>We’d love to hear about your stay! Please leave your feedback below.</p>

          <form onSubmit={handleReviewSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name (optional)"
              className="modern-input"
              value={reviewName}
              onChange={(e) => setReviewName(e.target.value)}
            />

            <textarea
              name="review"
              rows="4"
              placeholder="Write your review here..."
              required
              className="review-textarea"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            ></textarea>

            <button type="submit" className="review-submit-btn">
              Submit Review
            </button>
          </form>
        </section>
      )}

      {/* Display reviews below form */}
      <section className="reviews-list">
        <h2>Guest Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((r, idx) => (
            <div key={idx} className="single-review">
              <strong>{r.name || 'Anonymous'}</strong>
              <p>{r.review}</p>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default LandingPage;
