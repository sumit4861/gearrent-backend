const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Gear = require('../models/Gear');

//POST /reviews
exports.createReview = async(req, res) => {
  try{
    const {gearId, bookingId, rating, comment} = req.body;

    const booking = await Booking.findById(bookingId);
    if(!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'You can only review after booking is completed' });
    }

    if(booking.renter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to review this booking' });
    }

    const existing = await Review.findOne({booking: bookingId});
    if(existing) {
      return res.status(400).json({ message: 'You have already reviewed this booking' });
    }

    const review = await Review.create({
      gear: gearId,
      reviewer: req.user._id,
      booking: bookingId,
      rating,
      comment
    });
    res.status(201).json(review);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

//GET /reviews/:gearId
exports.getGearReviews = async(req, res) => {
  try{
    const reviews = await Review.find({gear: req.params.gearId})
    .populate('reviewer', 'name avatar')
    .sort({createdAt: -1});

    const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0)/reviews.length).toFixed(1) : 0;

    res.status(200).json({reviews, avgRating, total: reviews.length});

  }
  catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}