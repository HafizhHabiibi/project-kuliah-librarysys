const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { protect } = require('../middleware/auth');
const { authorizeRole } = require('../middleware/role');

// All book routes require authentication
router.use(protect);

// Routes accessible by all authenticated users
router.get('/', bookController.getAllBooks);
router.get('/detail/:id', bookController.getBookDetail);

// Admin-only routes
router.get('/add', authorizeRole('admin'), bookController.getAddBook);
router.post('/add', authorizeRole('admin'), bookController.postAddBook);
router.get('/edit/:id', authorizeRole('admin'), bookController.getEditBook);
router.post('/edit/:id', authorizeRole('admin'), bookController.postEditBook);
router.post('/delete/:id', authorizeRole('admin'), bookController.deleteBook);

module.exports = router;
