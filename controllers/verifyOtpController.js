const User = require("../models/user");

const verifyOtp = async (req, res) => {
  try {
    const otp = req.body.otp;
    console.log(otp);

    if (!otp) return res.status(400).json({ msg: "Otp is required!" });

    const findUser = await User.findOne({ otp }).exec();
    if (!findUser) {
      return res.status(400).json({ msg: "Incorrect otp" });
    }

    if (findUser.otpExpires.getTime() < Date.now())
      return res.status(400).json({
        msg: "Opt has been expired. Generate a new otp and try again",
      });

    findUser.otp = undefined;
    findUser.otpExpires = undefined;
    findUser.isverified = true;

    await findUser.save();

    res.status(200).json({ msg: "Verification comppleted!" });
  } catch (error) {
    res.status(500).json({ msg: "Please try again later" });
    console.error(error.message);
  }
};

module.exports = { verifyOtp };
