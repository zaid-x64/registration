const express = require("express");
const router = express.Router();
const passport = require("passport");

const CallbackFunction = require("../../controllers/googleCallbackController");
const { setUsername } = require("../../controllers/setUsernameController");
const { usernameSchema } = require("../../validators/username");
const { validateRequest } = require("../../middleware/validateRegistration");

router
  .get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  )

  .get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    CallbackFunction.googleCallbackFunction
  )

  .post(
    "/setUsername",
    require("../../middleware/verifyJWT"),
    validateRequest(usernameSchema),
    setUsername
  );

module.exports = router;
