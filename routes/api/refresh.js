const express = require('express');
const router = express.Router();
const refreshToken = require('../../controllers/refreshTokenController');

router.post('/',refreshToken.handleRefreshToken);

module.exports = router;