const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

//Routes
app.use('/auth', require('./routes/authRoutes'));

app.use('/gear', require('./routes/gearRoutes'));

app.use('/bookings', require('./routes/bookingRoutes'));

app.use('/reviews', require('./routes/reviewRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'GearRent API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
