const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

// All profile routes require authentication
router.use(protect);

router.get('/', profileController.getProfile);
router.post('/edit', profileController.postEditProfile);

module.exports = router;
