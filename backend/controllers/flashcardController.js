const asyncHandler = require('express-async-handler');
const Flashcard = require('../models/Flashcard');

// @desc    Create a new flashcard set
// @route   POST /api/flashcards
// @access  Private
const createFlashcard = asyncHandler(async (req, res) => {
  const { title, description, cards, isHidden } = req.body;

  // Check daily limit (20 sets per day)
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const todayCount = await Flashcard.countDocuments({
    user: req.user._id,
    createdAt: { $gte: startOfDay },
  });

  if (todayCount >= 20) {
    res.status(400);
    throw new Error('Daily flashcard creation limit reached');
  }

  const flashcard = new Flashcard({
    user: req.user._id,
    title,
    description,
    cards,
    isHidden: isHidden || false,
  });

  const createdFlashcard = await flashcard.save();
  res.status(201).json(createdFlashcard);
});

// @desc    Get all flashcards
// @route   GET /api/flashcards
// @access  Public
const getFlashcards = asyncHandler(async (req, res) => {
  const flashcards = await Flashcard.find({ isHidden: false }).populate('user', 'name');
  res.json(flashcards);
});

// @desc    Get flashcard by ID
// @route   GET /api/flashcards/:id
// @access  Public
const getFlashcardById = asyncHandler(async (req, res) => {
  const flashcard = await Flashcard.findById(req.params.id).populate('user', 'name');

  if (flashcard) {
    res.json(flashcard);
  } else {
    res.status(404);
    throw new Error('Flashcard not found');
  }
});

// @desc    Update flashcard
// @route   PUT /api/flashcards/:id
// @access  Private
const updateFlashcard = asyncHandler(async (req, res) => {
  const { title, description, cards, isHidden } = req.body;

  const flashcard = await Flashcard.findById(req.params.id);

  if (flashcard) {
    flashcard.title = title || flashcard.title;
    flashcard.description = description || flashcard.description;
    flashcard.cards = cards || flashcard.cards;
    flashcard.isHidden = isHidden !== undefined ? isHidden : flashcard.isHidden;

    const updatedFlashcard = await flashcard.save();
    res.json(updatedFlashcard);
  } else {
    res.status(404);
    throw new Error('Flashcard not found');
  }
});

// @desc    Delete flashcard
// @route   DELETE /api/flashcards/:id
// @access  Private
const deleteFlashcard = asyncHandler(async (req, res) => {
  const flashcard = await Flashcard.findById(req.params.id);

  if (flashcard) {
    await flashcard.remove();
    res.json({ message: 'Flashcard removed' });
  } else {
    res.status(404);
    throw new Error('Flashcard not found');
  }
});

// @desc    Rate a flashcard
// @route   POST /api/flashcards/:id/rate
// @access  Private
const rateFlashcard = asyncHandler(async (req, res) => {
  const { rating } = req.body;
  const flashcard = await Flashcard.findById(req.params.id);

  if (flashcard) {
    const alreadyRated = flashcard.ratings.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyRated) {
      alreadyRated.rating = rating;
    } else {
      flashcard.ratings.push({ user: req.user._id, rating });
    }

    await flashcard.save();
    res.json({ message: 'Flashcard rated' });
  } else {
    res.status(404);
    throw new Error('Flashcard not found');
  }
});

// @desc    Add a review to a flashcard
// @route   POST /api/flashcards/:id/reviews
// @access  Private
const addReview = asyncHandler(async (req, res) => {
  const { comment, rating } = req.body;

  // Validate request data
  if (!comment || !rating) {
    res.status(400);
    throw new Error('Please provide both a comment and a rating');
  }

  const flashcard = await Flashcard.findById(req.params.id);

  if (!flashcard) {
    res.status(404);
    throw new Error('Flashcard not found');
  }

  // Check if the user has already reviewed
  const alreadyReviewed = flashcard.reviews.find(
    (review) => review.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this flashcard');
  }

  // Add new review
  const review = {
    user: req.user._id,
    comment,
    rating: Number(rating),
  };

  flashcard.reviews.push(review);

  // Recalculate average rating
  flashcard.ratings.push({ user: req.user._id, rating: Number(rating) });

  await flashcard.save();
  res.status(201).json({ message: 'Review added successfully' });
});

// Export all controller functions
module.exports = {
  createFlashcard,
  getFlashcards,
  getFlashcardById,
  updateFlashcard,
  deleteFlashcard,
  rateFlashcard,
  addReview, // Fixed typo
};
