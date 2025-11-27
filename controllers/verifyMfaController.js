const User = require("../models/user");

const verifyOtp = async (req, res) => {
  const username = req.user.username;
  const { otp } = req.body;
  
  const findUser = await User.findOne({ username }).exec();
  if (!findUser) return res.status(401).json({ msg: "User not found" });
  if (!findUser.isverified)
    return res
      .status(400)
      .json({ msg: "Please complete the registration first" });
  if (findUser.mfa)
    return res.status(400).json({
      msg: `Multifactor Authentication has already been added to the ${findUser.username}`,
    });

  if (findUser.otpExpires.getTime() < Date.now()) {
    findUser.mfa = false;
    findUser.number = undefined;
    findUser.otp = undefined;
    findUser.otpExpires = undefined;
    await findUser.save();
    return res.status(400).json({
      msg: "Opt has been expired. Generate a new otp and try again",
    });
  }

  if (otp !== findUser.otp) {
    findUser.mfa = false;
    findUser.number = undefined;
    findUser.otp = undefined;
    findUser.otpExpires = undefined;
    await findUser.save();
    return res.status(401).json({ msg: "Invalid Otp" });
  }
  findUser.mfa = true;
  findUser.otp = undefined;
  findUser.otpExpires = undefined;
  await findUser.save();
  res.status(200).json({
    msg: `${findUser.number} has been added as multifactor authentication number to the ${findUser.username}`,
  });
};
module.exports = { verifyOtp };
