const express = require('express');
const router = express.Router();
const { createReview, getGearReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createReview);
router.get('/:gearId', getGearReviews);

module.exports = router;