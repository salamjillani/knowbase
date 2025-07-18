const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate unique referral code
const generateReferralCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

exports.register = async (req, res) => {
  try {
    const { email, username, password, inviteCode } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Check if username is already taken
    let existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken' });
    }
    
    // Generate unique referral code for the new user
    let referralCode;
    let isUnique = false;
    while (!isUnique) {
      referralCode = generateReferralCode();
      const existingCode = await User.findOne({ referralCode });
      if (!existingCode) {
        isUnique = true;
      }
    }
    
    // Create new user
    user = new User({ 
      email, 
      username, 
      password, 
      referralCode 
    });
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    // Handle invite code if provided
    if (inviteCode && inviteCode.trim() !== '') {
      const referringUser = await User.findOne({ referralCode: inviteCode.trim() });
      if (referringUser) {
        user.points += 50; // Bonus points for being referred
        user.referredBy = referringUser._id;
        
        // Give commission to referring user
        referringUser.commission += 10;
        await referringUser.save();
      }
    }
    
    await user.save();
    
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ 
      token, 
      user: { 
        id: user.id,
        email: user.email, 
        username: user.username, 
        points: user.points, 
        commission: user.commission,
        isVip: user.isVip,
        referralCode: user.referralCode
      } 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ 
      token, 
      user: { 
        id: user.id,
        email: user.email, 
        username: user.username, 
        points: user.points, 
        commission: user.commission,
        isVip: user.isVip,
        referralCode: user.referralCode
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};