const User = require('../models/User');

exports.unlockResult = async (req, res) => {
  try {
    const { userId } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.points < 1) {
      return res.status(400).json({ message: 'Insufficient points' });
    }
    
    user.points -= 1;
    await user.save();
    
    res.json({ points: user.points });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};