const express = require("express");
const router = express.Router();
const changepassword = require("../../controllers/changePasswordController");

const { validateRequest } = require("../../middleware/validateRegistration");
const { changepwdSchema } = require("../../validators/changepassword");


router.post("/", validateRequest(changepwdSchema),changepassword.changepwd);

module.exports = router;