const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const authenticateUser = async (req, res) => {
  const cookies = req.cookies;
  // console.log(`Cookie avaliable at login: ${JSON.stringify(cookies)}`);

  const { email, password } = req.body;

  const found = await User.findOne({ email }).exec();
  console.log(found);

  if (!found) return res.status(401).json({ msg: "User not found " });

  if (!found.isverified)
    return res
      .status(401)
      .json({ msg: "Please complete the Otp verification fist!" });

  const match = await bcrypt.compare(password, found.password);

  if (match) {
    const accessToken = jwt.sign(
      { id: findUser.id, role: findUser.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
    );

    const newRefreshToken = jwt.sign(
      { id: findUser.id, role: findUser.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    let newRefreshTokenArray = !cookies?.jwt
      ? found.refreshToken
      : found.refreshToken.filter((rt) => rt !== cookies.jwt);

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

    found.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    const saveUser = await found.save();
    console.log(saveUser);

    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    console.log(newRefreshToken);

    res.json({ accessToken });
  } else {
    res.status(401).json({ msg: "Incorrect password" });
  }
};

module.exports = { authenticateUser };
