const express = require('express');
const router = express.Router();
const { registerUser, authUser, getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Register a new user
router.post('/register', registerUser);

// Authenticate user & get token
router.post('/login', authUser);

// Get user profile
router.get('/profile', protect, getUserProfile);

module.exports = router;
