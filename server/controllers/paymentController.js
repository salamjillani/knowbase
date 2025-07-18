const User = require('../models/User');

exports.addPoints = async (req, res) => {
  try {
    const { userId, package } = req.body;
    const commissionRate = 0.15;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.points += package.points;
    
    if (user.referredBy) {
      const commission = package.price * commissionRate;
      const referrer = await User.findById(user.referredBy);
      if (referrer) {
        referrer.commission += commission;
        await referrer.save();
      }
    }
    
    await user.save();
    
    res.json({ points: user.points, commission: user.commission });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};