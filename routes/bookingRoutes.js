const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  approveBooking,
  rejectBooking,
  completeBooking,
  getBlockedDates
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/owner', protect, getOwnerBookings);
router.get('/blocked/:gearId', getBlockedDates);
router.patch('/:id/approve', protect, approveBooking);
router.patch('/:id/reject', protect, rejectBooking);
router.patch('/:id/complete', protect, completeBooking);

module.exports = router;