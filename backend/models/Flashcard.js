const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

const flashcardSchema = mongoose.Schema(
  {
    // Reference to the user who created the flashcard set
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },

    // Flashcard set title
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },

    // Optional description for the flashcard set
    description: {
      type: String,
    },

    // Array of questions and answers
    cards: [
      {
        question: {
          type: String,
          required: [true, 'Please add a question'],
        },
        answer: {
          type: String,
          required: [true, 'Please add an answer'],
        },
      },
    ],

    // Option to mark the flashcard as hidden
    isHidden: {
      type: Boolean,
      default: false,
    },

    // Array to store ratings
    ratings: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
      },
    ],

    // Array to store reviews
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        comment: {
          type: String,
          required: [true, 'Please add a comment'],
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Virtual field for average rating
flashcardSchema.virtual('averageRating').get(function () {
  if (!this.ratings || this.ratings.length === 0) return 0;
  const total = this.ratings.reduce((sum, r) => sum + r.rating, 0);
  return total / this.ratings.length;
});

// Virtual field for total number of ratings
flashcardSchema.virtual('totalRatings').get(function () {
  return this.ratings?.length || 0;
});

// Virtual field for total number of reviews
flashcardSchema.virtual('totalReviews').get(function () {
  return this.reviews?.length || 0;
});

const Flashcard = mongoose.model('Flashcard', flashcardSchema);

module.exports = Flashcard;
