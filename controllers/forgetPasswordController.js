const User = require("../models/user");
const speakeasy = require("speakeasy");
const nodemailer = require("nodemailer");
require("dotenv").config();


const sendemail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.verify();

    const info = await transporter.sendMail({
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: "Forget Password OTP",
      html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 24px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px; margin: auto; background-color: #fafafa;">
  <h2 style="color: #333; text-align: center;">Password Reset OTP</h2>

  <p style="color: #555; font-size: 15px;">
    Hello,
  </p>

  <p style="color: #555; font-size: 15px;">
    We received a request to reset your account password. Use the OTP below to verify your identity and reset your password securely.
  </p>

  <div style="text-align: center; margin: 30px 0;">
    <div style="display: inline-block; background-color: #007bff; color: white; padding: 14px 28px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 4px;">
      ${otp}
    </div>
  </div>

  <p style="color: #555; font-size: 15px;">
    This OTP is valid for <strong>5 minutes</strong>. Please do not share it with anyone for your account’s safety.
  </p>

  <p style="color: #888; font-size: 13px; margin-top: 30px; text-align: center;">
    If you didn’t request a password reset, you can safely ignore this email.
  </p>

  <p style="color: #888; font-size: 13px; margin-top: 30px; text-align: center;">
    © ${new Date().getFullYear()} YourAppName — All rights reserved.
  </p>
</div>

`,
    });

    console.log(`The email has been sent to the ${email}`);
    return { success: true };
  } catch (error) {
    console.error(`Email sending failed`, error.message);
    return { success: false };
  }
};

const forgetpwd = async (req, res) => {
  try {
    const { email } = req.body;

    console.log(email);
    if (!email) return res.status(400).json({ msg: "Email is required" });
    const findUser = await User.findOne({ email }).exec();

    if (!findUser)
      return res.status(404).json({
        msg: "Email not found please complete the registration first",
      });

    const tempSecret = speakeasy.generateSecret({ length: 20 }).base32;
    const forgetpassOtp = speakeasy.totp({
      secret: tempSecret,
      encoding: "base32",
      digits: 6,
      step: 60 * 5,
    });

    const forgetpassOtpExpires = new Date(Date.now() + 5 * 60 * 1000);

    findUser.otp = forgetpassOtp;
    findUser.otpExpires = forgetpassOtpExpires;

    await findUser.save();

    const emailresult = await sendemail(email, forgetpassOtp);

    if (!emailresult.success)
      return res.status(400).json({ msg : "The email has not been send" });

    return res.status(200).json({ msg: "The email has been sent" });
  } catch (error) {
    res.status(500).json({ msg: error.messag });
  }
};

module.exports = { forgetpwd };
