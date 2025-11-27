require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const connectDB = require("./config/dbconnect");
const cookieParser = require("cookie-parser");
require("./config/passport");
const PORT = process.env.PORT || 3500;
const verifyRole = require("./middleware/verifyRole");

connectDB();

const path = require("path");
app.use(express.static(path.join(__dirname, "frontend")));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", require("./routes/api/auth"));

app.use("/oauth", require("./routes/api/oauth"));

app.use("/refresh", require("./routes/refresh"));

app.use(require("./middleware/verifyRole"));

app.use(require("./middleware/verifyJWT"));

app.use("/change-password", require("./routes/api/changepassword"));

// app.use("/deletepost", verifyRole("admin"), xyzroute);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
