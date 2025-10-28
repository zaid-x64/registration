require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const connectDB = require('./config/dbconnect');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 3500;
connectDB();


app.use(express.urlencoded({ extended: false }));
app.use(express.json());  
app.use(cookieParser());     



app.use('/register', require('./routes/api/register'));
app.use('/auth',require('./routes/api/auth'));
app.use('/refresh',require('./routes/api/refresh'));
app.use('/logout', require('./routes/api/logout'));

app.use(require('./middleware/verifyJWT'));

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
