const User = require("../models/user");

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  const refreshToken = cookies.jwt;
  console.log(refreshToken);

  const foundUser = await User.findOne({ refreshToken }).exec();

  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.status(204).json({ msg: "User not found!" });
  }

  foundUser.refreshToken = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );
  const result = await foundUser.save();
  console.log(result);

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None" });
  res.status(200).json({ msg: "User has been logged out successfully" });
};

module.exports = { handleLogout };
