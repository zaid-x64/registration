const express = require('express');
const router = express.Router();
const authUser = require('../../controllers/authController');

router.post('/',authUser.authenticateUser);

module.exports = router;