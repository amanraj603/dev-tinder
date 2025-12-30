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