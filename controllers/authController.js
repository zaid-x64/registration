const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const authenticateUser = async (req, res) => {
  const cookies = req.cookies;
  console.log(`Cookie  avaliable at login: ${JSON.stringify(cookies)}`);

  const email = req.body.email?.toLowerCase().trim();
  const username = req.body.username?.toLowerCase().trim();
  const pwd = req.body.password;

  if (!email && !username)
    return res.status(400).json({ message: "Email or username is required" });

  if (!pwd) return res.status(400).json({ message: "Password is required" });

  const found = await User.findOne({ $or: [{ email }, { username }] }).exec();

  if (!found) return res.status(401).json({ message: "User not found " });

  const match = await bcrypt.compare(pwd, found.password);

  if (match) {

    const accessToken = jwt.sign(
      { username: found.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15s" }
    );

    const newRefreshToken = jwt.sign(
      { username: found.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // removing the RT from the DB
    let newRefreshTokenArray = !cookies?.jwt
      ? found.refreshToken
      : found.refreshToken.filter((rt) => rt !== cookies.jwt);

    // RT reuse
    if (cookies?.jwt) {
      const refreshToken = cookies.jwt;
      const foundToken = await User.findOne({ refreshToken }).exec();

      if (!foundToken) {
        newRefreshTokenArray = [];
      }

      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
    }

    // Saving refreshToken with in DB
    found.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    const result = await found.save();
    console.log(result);

    // Creates Secure Cookie with refresh token
    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    console.log(newRefreshToken);

    // Send access token to user
    res.json({ accessToken });
  } else {
    res.status(401).json({ message: "Incorrect password" });
  }
};

module.exports = { authenticateUser };
