const User = require("../models/user");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  const email = req.body.email?.toLowerCase().trim();
  const username = req.body.username?.toLowerCase().trim();
  const pwd = req.body.password;

  if (!username && !email) {
    return res.status(400).json({ message: "Username and email are required" });
  }

  if (!pwd) return res.status(400).json({ message: "Password is required!" });



  const duplicateEmail = await User.findOne({ email });
  const duplicateName = await User.findOne({ username });

  if (duplicateEmail) {
    return res.status(409).json({ message: "The email already exists" });
  }
  if (duplicateName) {
    return res.status(409).json({ message: "Username already exists" });
  }

  try {
    const hashPwd = await bcrypt.hash(pwd, 10);

    const newUser = await User.create({
      username: username,
      password: hashPwd,
      email: email.toLowerCase(),
    });

    res.status(201).json({
      message: `User ${username} created successfully`,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerUser };
