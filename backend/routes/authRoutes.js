const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/login', authController.loginAdmin);
router.post('/register', authController.registerAdmin);
router.post('/refresh', authController.refreshToken); // New route for token refresh
router.post('/logout', authMiddleware, authController.logoutAdmin);

module.exports = router;