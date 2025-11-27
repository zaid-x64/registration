require("dotenv").config();
const jwt = require("jsonwebtoken");

const googleCallbackFunction = async (req, res) => {
  try {
    const user = req.user;
    console.log("Logged in user:", user);
    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 1 * 24 * 60 * 60 * 1000,
      sameSite: "None",
    });

    user.refreshToken = refreshToken;
    await user.save();

    res.redirect(`${process.env.CLIENT_URL}/index2.html?token=${accessToken}`);
  } catch (error) {
    console.log("Google login error:", error.message);
    res.redirect(`${process.env.CLIENT_URL}`);
  }
};

module.exports = { googleCallbackFunction };
