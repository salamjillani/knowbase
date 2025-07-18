const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  points: { type: Number, default: 0 },
  commission: { type: Number, default: 0 },
  isVip: { type: Boolean, default: false },
  referralCode: { 
    type: String, 
    unique: true, 
    sparse: true  // This allows multiple null values
  },
  // Add inviteCode field to match your database index
  inviteCode: { 
    type: String, 
    unique: true, 
    sparse: true  // This allows multiple null values
  },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);