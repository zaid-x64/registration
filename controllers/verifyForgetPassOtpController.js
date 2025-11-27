const User = require("../models/user");
const jwt = require("jsonwebtoken");

const verifyOtp = async (req, res) => {
  try {
    const otp = req.body.otp;

    if (!otp) return res.status(400).json({ msg: "Otp is required!" });

    const findUser = await User.findOne({ otp }).exec();
    if (!findUser) {
      return res.status(400).json({ msg: "Incorrect otp" });
    }

    if (!findUser.isverified)
      return res
        .status(401)
        .json({ msg: "Please complete the registration first" });

    if (findUser.otpExpires.getTime() < Date.now())
      return res.status(400).json({
        msg: "Opt has been expired. Generate a new otp and try again",
      });

    findUser.otp = undefined;
    findUser.otpExpires = undefined;

    const accessToken = jwt.sign(
      { email: findUser.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10m" }
    );

    await findUser.save();

    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(500).json({ msg: "Please try again later" });
    console.error(error.message);
  }
};

module.exports = { verifyOtp };
