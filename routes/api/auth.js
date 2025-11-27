const express = require("express");
const router = express.Router();

// controllers
const registerUser = require("../../controllers/registerController");
const verification = require("../../controllers/verifyOtpController");
const loginUser = require("../../controllers/loginController");
const refreshToken = require("../../controllers/refreshTokenController");
const logout = require("../../controllers/logoutController");
const resendotp = require("../../controllers/resendOtpController");
const forgetpassword = require("../../controllers/forgetPasswordController");
const verifyForgetPassword = require("../../controllers/resetPasswordController");
const verifyForgetOtp = require("../../controllers/verifyForgetPassOtpController");
const mfa = require("../../controllers/mfaController");
const verifyMfaOtp = require("../../controllers/verifyMfaController");
const resendMfaOtp = require("../../controllers/resendMfaOtpController");

const { loginSchema } = require("../../validators/loginValidator");
const { registrationSchema } = require("../../validators/registerValidator");
const { resetpwdSchema } = require("../../validators/resetpssword");
const { otpSchema } = require("../../validators/otp");
const { mfaOtpSchema } = require("../../validators/mfaotp");
const { validateRequest } = require("../../middleware/validateRegistration");

router
  .post(
    "/register",
    validateRequest(registrationSchema),
    registerUser.registerUser
  )

  .post("/resend-reg-otp", resendotp.resendingotp)

  .post("/verify-otp", validateRequest(otpSchema), verification.verifyOtp)

  .post("/login", validateRequest(loginSchema), loginUser.authenticateUser)

  .post("/refresh", refreshToken.handleRefreshToken)

  .post("/forget-password", forgetpassword.forgetpwd)

  .post(
    "/forget-otpverify",
    validateRequest(otpSchema),
    verifyForgetOtp.verifyOtp
  )

  .post(
    "/reset-password",
    validateRequest(resetpwdSchema),
    verifyForgetPassword.verifyForgetPassword
  )

  .post("/mfa", require("../../middleware/verifyJWT"), mfa.sendOtp)

  .post(
    "/mfa-Otpverify",
    require("../../middleware/verifyJWT"),
    validateRequest(mfaOtpSchema),
    verifyMfaOtp.verifyOtp
  )

  .post(
    "/resend-mfaOtp",
    require("../../middleware/verifyJWT"),
    resendMfaOtp.resendOtp
  )

  .post("/logout", logout.handleLogout);

module.exports = router;
