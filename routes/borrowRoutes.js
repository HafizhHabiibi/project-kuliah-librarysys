const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrowController');
const { protect } = require('../middleware/auth');
const { authorizeRole } = require('../middleware/role');

// All borrow routes require authentication and user role
router.use(protect);
router.use(authorizeRole('user'));

router.post('/:bookId', borrowController.borrowBook);
router.post('/return/:id', borrowController.returnBook);
router.get('/mybooks', borrowController.getMyBooks);

module.exports = router;
