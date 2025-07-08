const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { search } = require('../controllers/searchController');

router.post('/', auth, search);

module.exports = router;