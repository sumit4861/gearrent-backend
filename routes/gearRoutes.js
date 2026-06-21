const express = require('express');
const router = express.Router();
const {
  getAllGear, 
  getGearById,
  createGear,
  updateGear,
  deleteGear,
  generateDescription
} = require('../controllers/gearController');
const {protect} = require('../middleware/authMiddleware');
const {upload} = require('../utils/cloudinary');

router.get('/', getAllGear);
router.get('/:id', getGearById);
router.post('/', protect, upload.array('images', 4), createGear);
router.put('/:id', protect, updateGear);
router.delete('/:id', protect, deleteGear);

router.post('/generate-description', protect, generateDescription);
module.exports = router;