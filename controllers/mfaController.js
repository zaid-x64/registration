const User = require("../models/user");
const speakeasy = require("speakeasy");
const twilio = require("twilio");
require("dotenv").config();

const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendOtpToPhone = async (number, otp) => {
  try {
    const message = await client.messages.create({
      body: `Your verification code is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: number,
    });

    console.log("OTP sent successfully:");
    return true;
  } catch (error) {
    console.error("Error sending OTP, try again");
    return false;
  }
};

const sendOtp = async (req, res) => {
  const username = req.user.username;
  const { number } = req.body;
  console.log(number);

  const findUser = await User.findOne({ username }).exec();

  const findNumber = await User.findOne({ number }).exec();

  if (findUser.mfa)
    return res
      .status(400)
      .json({
        msg: "Multifactor authentication has already been added to this account",
      });

  if (findNumber)
    return res
      .status(400)
      .json({
        msg: "The number already exists please try with anothre number",
      });

  if (!findUser) res.status(401).json({ msg: "User not found" });

  const tempSecret = speakeasy.generateSecret({ length: 20 }).base32;

  const otp = speakeasy.totp({
    secret: tempSecret,
    encoding: "base32",
    digits: 6,
    step: 60,
  });

  const otpExpires = new Date(Date.now() + 2 * 60 * 1000);

  const sent = await sendOtpToPhone(number, otp);

  if (!sent) {
    return res.status(500).json({ msg: error.message });
  }

  findUser.number = number;
  findUser.otp = otp;
  findUser.otpExpires = otpExpires;
  await findUser.save();

  res.json({ msg: "OTP sent successfully!" });
};
module.exports = { sendOtp };
