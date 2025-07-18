const WithdrawalRequest = require('../models/WithdrawalRequest');
const User = require('../models/User');

exports.requestWithdrawal = async (req, res) => {
  try {
    const { userId, amount, usdtAddress } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.commission < amount) {
      return res.status(400).json({ message: 'Insufficient commission balance' });
    }
    
    if (amount < 100) {
      return res.status(400).json({ message: 'Minimum withdrawal is ¥100' });
    }
    
    const withdrawal = new WithdrawalRequest({
      user: userId,
      amount,
      usdtAddress,
      status: 'pending'
    });
    
    await withdrawal.save();
    
    user.commission -= amount;
    await user.save();
    
    res.json({ message: 'Withdrawal request submitted', balance: user.commission });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};