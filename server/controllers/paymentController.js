const User = require('../models/User');

exports.addPoints = async (req, res) => {
  try {
    const { userId, package } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.points += package.points;
    await user.save();
    
    res.json({ points: user.points });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};