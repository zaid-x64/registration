const User = require("../models/user");
const bcrypt = require("bcrypt");

const changepwd = async (req, res) => {

  const username = req.user.username;
  const { password, newpassword , verifypassword } = req.body;

  const findUser = await User.findOne({ username }).exec();

  if (!findUser) return res.status(401).json({ msg : "User not found " });

  if (!findUser.isverified)
    return res
      .status(401)
      .json({ msg : "Please complete the Otp verification fist!" });

  const match = await bcrypt.compare(password, findUser.password);

  if (!match) return res.status(401).json({ msg: "Incorrect password" });

  if(newpassword!==verifypassword)return res.status(400).json({msg:"Verify the password correctly"})

  const hashedpwd = await bcrypt.hash(newpassword, 10);
  findUser.password = hashedpwd;

  await findUser.save();
  res.status(201).json({
    msg: "The password of this user has been updated successfully:",
    user: {
      username: findUser.username,
      email: findUser.email,
    },
  });
};

module.exports = { changepwd };
