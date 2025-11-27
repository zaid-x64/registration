const User = require("../models/user");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

  try {
    const findUser = await User.findOne({
      refreshToken: { $in: [refreshToken] },
    }).exec();

    if (!findUser) {
      try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );
        console.log("attempted refresh token reuse!");

        const hackedUser = await User.findById(decoded.id).exec();
        if (hackedUser) {
          hackedUser.refreshToken = [];
          await hackedUser.save();
        }

        return res.sendStatus(403);
      } catch (err) {
        return res.sendStatus(403);
      }
    }

    const newRefreshTokenArray = findUser.refreshToken.filter(
      (rt) => rt !== refreshToken
    );

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      if (decoded.id !== findUser.id) {
        return res.sendStatus(403);
      }
    } catch (err) {
      console.log("expired or invalid refresh token");
      findUser.refreshToken = [...newRefreshTokenArray];
      await findUser.save();
      return res.sendStatus(403);
    }

    const accessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
    );

    const newRefreshToken = jwt.sign(
      { id: findUser.id, role: findUser.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    findUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    await findUser.save();

    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

module.exports = { handleRefreshToken };
