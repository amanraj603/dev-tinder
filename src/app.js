const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const valideteSignupData = require('./utils/validationFunc');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cookieParser());
app.use(express.json());

app.post('/signup', async(req, res) => {
  try {
    // Validation of data
    valideteSignupData(req);
    
    const { firstName, lastName, emailId, password } = req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Creating a new instance of User model
    const newUser = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash
    });
    await newUser.save();
    res.send("User Registered Successfully");
  } catch (error) {
    res.status(400).send("Error registering user :" + error.message);
  }
});

app.post('/login', async(req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if(!user){
      throw new Error("User not found");
    }
    
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if(!isPasswordMatch){
      throw new Error("Invalid credentials");
    }

    // create JWT token
    const token = jwt.sign({ userId: user._id }, "DEV@TINDER$790");
    
    // Add JWT token to cookie and send response back to client
    res.cookie("token", token);
    res.status(200).send("Login Successful");
    
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
})

app.get('/profile', async(req, res) => {
  try {
    // verify token
    const {token} = req.cookies;
    if(!token){
      throw new Error("Token not present");
    }
    const decodedMsg = jwt.verify(token, "DEV@TINDER$790");
    // fetch user data
    const user = await User.findById(decodedMsg.userId);
    if(!user){
      throw new Error("User not found");
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send("Error fetching profile: " + error.message);
  }
});

app.get('/feed', async(req, res) => {
  // Fetching all users except the one making the request
  try {
    const allUser = await User.find({});
    res.send(allUser);
  } catch (error) {
    res.status(500).send("Error fetching users: " + error.message);
  }
});

app.delete('/user', async(req, res) => {
  try {
    const deletedUser = await User.deleteOne(req.body);
    console.log(deletedUser);
    res.status(200).send(`User with id ${req.body} deleted successfully`);
  } catch (error) {
    res.status(500).send("Error while deleting users: " + error.message);
  }
});

app.patch('/user/:userId', async(req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {

    const ALLOWED_UPDATES = ['password', 'age', 'gender', 'photoUrl', 'about', 'skills'];
    const isUpdateAllowed = Object.keys(data).every( item => ALLOWED_UPDATES.includes(item));

    if(!isUpdateAllowed){
      throw new Error("Update not allowed");
    }

    if(data.skills?.length > 10){
      throw new Error("Data cannot exceed more than 10");
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      runValidators: true
    })
    res.status(200).send("User updated successfully");
  } catch (error) {
    res.status(500).send("Error while Updating users: " + error.message);
  }
})

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