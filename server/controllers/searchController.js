const collectionMap = require('../models/DataModel');
const User = require('../models/User');

exports.search = async (req, res) => {
  try {
    const { query, type } = req.body;
    const userId = req.user.id;
    
    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.points < 1) {
      return res.status(400).json({ message: 'Insufficient points' });
    }
    
    const collections = Object.keys(collectionMap);
    let results = [];
    
    for (const collection of collections) {
      const Model = collectionMap[collection];
      let searchQuery = {};
      
      if (type === 'phoneNumber') {
        searchQuery = { phone: { $regex: query, $options: 'i' } };
      } else if (type === 'email') {
        searchQuery = { email: { $regex: query, $options: 'i' } };
      } else if (type === 'idNumber') {
        searchQuery = { idNumber: { $regex: query, $options: 'i' } };
      } else {
        searchQuery = { 
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { phone: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
            { idNumber: { $regex: query, $options: 'i' } }
          ]
        };
      }
      
      const data = await Model.find(searchQuery).limit(5);
      results = results.concat(data.map(item => ({ ...item._doc, source: collection })));
    }
    
    user.points -= 1;
    await user.save();
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};