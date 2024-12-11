const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware'); // Middleware
const { getAdminDashboard } = require('../controllers/adminController'); // Ensure this is correctly imported

console.log({ getAdminDashboard });

// Admin Dashboard Route
router.get('/dashboard', protect, isAdmin, getAdminDashboard);

module.exports = router;
