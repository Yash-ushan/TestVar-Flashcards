const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Flashcard = require('../models/Flashcard');

// @desc    Get admin dashboard data
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getAdminDashboard = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalFlashcards = await Flashcard.countDocuments();

  const recentActivity = [
    { description: 'User John created a flashcard set', date: new Date() },
    { description: 'Flashcard "React Basics" rated 5 stars', date: new Date() },
  ];

  res.status(200).json({
    totalUsers,
    totalFlashcards,
    recentActivity,
  });
});

module.exports = { getAdminDashboard }; // Ensure this is exported
