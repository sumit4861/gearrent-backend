const Gear = require('../models/Gear');
const Groq = require('groq-sdk');
//GET /gear - all listings with optional filters
exports.getAllGear = async (req, res) => {
  try{
    const {category, maxPrice, search} = req.query;
    let filter = {};

    if(category) filter.category = category;
    if(maxPrice) filter.pricePerDay = {$lte: Number(maxPrice)};
    if (search) filter.title = { $regex: search, $options: 'i'};

    const gear = await Gear.find(filter)
      .populate('owner', 'name email location avatar')
      .sort({createdAt: -1});

    res.status(200).json(gear);
  } catch(err) {
    res.status(500).json({message: 'Server error', error: err.message});
  }
}

//GET /gear/:id 
exports.getGearById = async(req, res) => {
  try{
    const gear = await Gear.findById(req.params.id)
      .populate('owner', 'name email location avatar');

    if(!gear) {
      return res.status(404).json({message: 'Gear not found'});
    }
    res.status(200).json(gear);

  }catch(err) {
    res.status(500).json({message: 'Server error', error: err.message});
  }
}

//POST /gear - create listing (auth required)
exports.createGear = async (req, res) => {
  try{
    const {title, description, category, condition, pricePerDay, deposit, location} = req.body;

    const images = req.files ? req.files.map(f => f.path) : [];

    const gear = await Gear.create({
      owner: req.user._id,
      title, 
      description,
      category,
      condition,
      pricePerDay,
      deposit,
      images,
      location
    });

    res.status(201).json(gear);
  } catch(err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

//PUT /gear/:id - update listing(owner only)
exports.updateGear = async (req, res) => {
  try{
    const gear = await Gear.findById(req.params.id);

    if(!gear) {
      return res.status(404).json({ message: 'Gear not found' });
    }

    if(gear.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({message: 'Not authorized to update this listing'});
    }

    const updated = await Gear.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true, runValidators: true}
    );

    res.status(200).json(updated);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

//DELETE /gear/:id = delete listing(owner only)
exports.deleteGear = async (req, res) => {
  try{
    const gear = await Gear.findById(req.params.id);

    if(!gear) {
      return res.status(404).json({ message: 'Gear not found' });
    }

    if(gear.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await gear.deleteOne();
    res.status(200).json({message: 'Gear deleted successfully'});

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

//POST /generate-description
exports.generateDescription = async(req, res) => {
  try {
    const {title, category, condition} = req.body;

    if(!title || !category || !condition) {
      return res.status(400>json({message: 'title, category and condition are required'}));
    }

    const client = new Groq({apiKey: process.env.GROQ_API_KEY});

    const completion = await client.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: `Write a short . attractive gear rental listing descriptionfor the following item. 
          Keep it 3-4 sentences.Be specific and highlight key benifits for a renter.
          Gear name: ${title}
          Category: ${category}
          Condition: ${condition}

          Only return the description text, nothin else.`
        }
      ]
    });

    const description = completion.choices[0].message.content;
    res.status(200).json({description});

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}