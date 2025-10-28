const express = require('express');
const router = express.Router();
const logout = require('../../controllers/logoutController');

console.log(logout.handleLogout)

router.post('/',logout.handleLogout);

module.exports = router;