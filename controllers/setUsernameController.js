const User = require("../models/user");

const setUsername = async (req, res) => {
  try {
    const id = req.user.id;
    const username = req.body.username;
    if (!username)
      return res.status(400).json({ msg: "User name is required" });

    const duplicateUsername = await User.findOne({ username });
    if (duplicateUsername)
      return res.status(409).json({ msg: "The username already exists" });

    const findUser = await User.findOne({ id });

    if (!findUser) return res.status(401).json({ msg: "Unauthorize" });

    console.log(findUser.refreshToken);

    findUser.username = username;
    await findUser.save();

    return res.status(200).json({ msg: "Username has been updated" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = { setUsername };
