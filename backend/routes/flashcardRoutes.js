const express = require('express');
const router = express.Router();
const {
  createFlashcard,
  getFlashcards,
  getFlashcardById,
  updateFlashcard,
  deleteFlashcard,
  rateFlashcard,
} = require('../controllers/flashcardController');
const { protect } = require('../middleware/authMiddleware');
const { addReview } = require('../controllers/flashcardController');


// Add a review to a flashcard
router.post('/:id/reviews', protect, addReview);

// Get all public flashcards
router.get('/', getFlashcards);

// Get a specific flashcard by ID
router.get('/:id', getFlashcardById);

// Create a new flashcard set
router.post('/', protect, createFlashcard);

// Update a flashcard set
router.put('/:id', protect, updateFlashcard);

// Delete a flashcard set
router.delete('/:id', protect, deleteFlashcard);

// Rate a flashcard
router.post('/:id/rate', protect, rateFlashcard);

module.exports = router;
