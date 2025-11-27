const User = require("../models/user");
const bcrypt = require("bcrypt");
const speakeasy = require("speakeasy");
const nodemailer = require("nodemailer");

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
      subject: "Your OTP Code",
      html: `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #333;">OTP Verification</h2>
        <p>Hello,</p>
        <p>Thank you for registering with us. To complete your registration, please use the following One-Time Password (OTP):</p>
        <h3 style="background-color: #f0f0f0; color: #555; padding: 10px; border-radius: 4px; text-align: center;">${otp}</h3>
        <p>This OTP is valid for a limited time. Do not share it with anyone.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>`,
    });

    console.log(`The email has been sent to the ${email}`);
    return { success: true };
  } catch (error) {
    console.error(`Email sending failed`, error.message);
    return { success: false };
  }
};

const registerUser = async (req, res) => {
  const { email, username, password } = req.body;
  const duplicateEmail = await User.findOne({ email }).exec();
  const duplicateName = await User.findOne({ username });

  if (duplicateEmail) {
    return res.status(409).json({ msg: "The email already exists" });
  }
  if (duplicateName) {
    return res.status(409).json({ msg: "Username already exists" });
  }

  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const tempSecret = speakeasy.generateSecret({ length: 20 }).base32;
    const otp = speakeasy.totp({
      secret: tempSecret,
      encoding: "base32",
      digits: 6,
      step: 60 * 2,
    });

    const otpExpires = new Date(Date.now() + 2 * 60 * 1000);

    const emailresult = await sendemail(email, otp);
    if (!emailresult.success)
      return res.status(400).json({ msg: "the email has not been send" });

    const newUser = await User.create({
      username: username,
      password: hashPassword,
      email: email.toLowerCase(),
      otp,
      otpExpires,
      isverified: false,
      role,
    });

    res.status(201).json({
      msg: `User ${username} created successfully`,
      user: {
        id: newUser._id,
        role: newUser.role,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerUser };
