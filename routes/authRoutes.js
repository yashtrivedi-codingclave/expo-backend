const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, getAdminProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// @route   POST /api/auth/register
router.post('/register', registerAdmin);

// @route   POST /api/auth/login
router.post('/login', loginAdmin);

// @route   GET /api/auth/profile
router.get('/profile', protect, getAdminProfile);

module.exports = router;
