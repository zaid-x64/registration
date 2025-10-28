const express = require('express');
const router = express.Router();
const registerUser = require('../../controllers/registerController');

router.post('/', registerUser.registerUser);

module.exports = router;