const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addPoints } = require('../controllers/paymentController');

router.post('/add-points', auth, addPoints);

module.exports = router;