require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const searchRoutes = require('./routes/search');
const paymentRoutes = require('./routes/payment');
const unlockRoutes = require('./routes/unlock');
const withdrawalRoutes = require('./routes/withdrawal');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/unlock', unlockRoutes);
app.use('/api/withdraw', withdrawalRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));