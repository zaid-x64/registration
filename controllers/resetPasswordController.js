const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const verifyForgetPassword = async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];

    if (!accessToken)
      return res.status(400).json({
        msg: "Token is required",
      });

    const { newpassword, verifypassword } = req.body;
    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      return res.status(401).json({ msg: "invalid token" });
    }

    const findUser = await User.findOne({ email: decoded.email }).exec();

    if (!findUser) {
      return res.status(400).json({ msg: "Wrong email" });
    }

    if (!findUser.isverified)
      return res
        .status(403)
        .json({ msg: "Please complete the registration fist!" });

    if (newpassword !== verifypassword)
      return res
        .status(400)
        .json({ msg: "Please verify the password correctly" });

    const hashedpassword = await bcrypt.hash(newpassword, 10);

    findUser.password = hashedpassword;
    findUser.forgetpassToken = null;
    findUser.forgetpassTokenExpires = null;
    await findUser.save();

    res
      .status(200)
      .json({ msg: `Password of the ${findUser.username} has been updated` });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = { verifyForgetPassword };
