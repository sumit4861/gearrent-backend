const Booking = require('../models/Booking');
const Gear = require('../models/Gear');

//POST /bookings - create booking request
exports.createBooking = async(req, res) => {
  try{
    const {gearId, startDate, endDate} = req.body;
    const gear = await Gear.findById(gearId);

    if(!gear) {
      return res.status(404).json({ message: 'Gear not found' });
    }

    if(gear.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({message: 'You cannot book your own gear'});
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if(start >= end) {
      return res.status(400).json({message: 'End date must be after start date'});
    }
    if (start < new Date()) {
      return res.status(400).json({ message: 'Start date cannot be in the past' });
    }
    const conflict = await Booking.findOne({
      gear: gearId,
      status: {$in: ['pending', 'approved']},
      $or: [
        {startDate: {$lt: end}, endDate:{$gt: start}}
      ]
    });

    if(conflict) {
      return res.status(409).json({message: 'Gear is not available for these dates'});
    }

    const totalDays = Math.ceil((end - start) / (1000*60*60*24));
    const totalPrice = totalDays * gear.pricePerDay;

    const booking = await Booking.create({
      gear: gearId,
      renter: req.user._id,
      startDate: start,
      endDate: end,
      totalDays,
      totalPrice,
      deposit: gear.deposit,
      status: 'pending'
    });

    res.status(201).json(booking);

  } catch(err) {
    res.status(500).json({message: 'Server error', error: err.message});
  }
};

//GET /bookings/my - all booking made by logged in renter
exports.getMyBookings  =async(req, res) => {
  try{
    const bookings = await Booking.find({renter: req.user._id})
      .populate('gear', 'title images pricePerDay location category')
      .populate('renter', 'name email')
      .sort({createdAt: -1});

    res.status(200).json(bookings);

  } catch(err) {
    res.status(500).json({message: 'Server error', error: err.message});
  }
};

//GET /bookings/owner - all bookings for gear owned by looged in user
exports.getOwnerBookings = async(req, res) => {
  try{
    const gear = await Gear.find({owner: req.user._id});
    const gearIds = gear.map(g => g._id);

    const bookings = await Booking.find({gear: {$in: gearIds}})
      .populate('gear', 'title images pricePerDay location')
      .populate('renter', 'name email location')
      .sort({createdAt: -1});

    res.status(200).json(bookings);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

//PATCH /bookings/:id/approve - owner approves booking
exports.approveBooking = async(req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('gear');

    if(!booking)  {
      return res.status(404).json({message: 'Booking not found'});
    }

    if(booking.gear.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({message: 'Not authorized'});
    }

    if(booking.status !== 'pending') {
      return res.status(400).json({message: 'Booking is not pending'});
    }

    booking.status = 'approved';
    await booking.save();
    res.status(200).json(booking);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

//PATCH /bookings/:id/reject - owner rejects booking
exports.rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('gear');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.gear.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Booking is not pending' });
    }

    booking.status = 'rejected';
    await booking.save();
    res.status(200).json(booking);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

//PATCH /bookings/:id/complete - mark booking as completed
exports.completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('gear');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.gear.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.status !== 'approved') {
      return res.status(400).json({ message: 'Booking is not approved' });
    }

    booking.status = 'completed';
    await booking.save();
    res.status(200).json(booking);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

//GET /bookings/blocked/:gearId - get blocked dates for a gear
exports.getBlockedDates = async(req, res) => {
  try{
    const bookings = await Booking.find({
      gear: req.params.gearId,
      status: {$in: ['pending', 'approved']}
    }).select('startDate endDate');

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}