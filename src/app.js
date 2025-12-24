const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const app = express();
const PORT = process.env.PORT || 3000;

app.post('/signup', async(req, res) => {
  // Signup logic here
  const userObj = {
    firstName: "Aman",
    lastName: "Raj",
    emailId: "aman.raj@gmail.com",
    password: "amanraj123",
  }
  
  const newUser = new User(userObj);

  try {
    await newUser.save();
    res.send("User Registered Successfully");
  } catch (error) {
    res.status(400).send("Error registering user :" + error.message);
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to Dev Tinder!');
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed", err);
  });