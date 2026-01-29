const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cookieParser());
app.use(express.json());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestsRouter = require('./routes/request');
const userRouter = require('./routes/user');

app.use('/', profileRouter);
app.use('/', authRouter);
app.use('/', requestsRouter);
app.use('/', userRouter);

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