const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { unlockResult } = require('../controllers/unlockController');

router.post('/', auth, unlockResult);

module.exports = router;