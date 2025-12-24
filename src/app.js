const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.post('/signup', async(req, res) => {
  // Signup logic here
 
  // Creating a new instance of User model
  const newUser = new User(req.body);

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