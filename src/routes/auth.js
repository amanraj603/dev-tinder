const express = require('express');
const bcrypt = require("bcrypt");
const User = require("../models/user");
const {valideteSignupData} = require("../utils/validationFunc");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
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
      password: passwordHash,
    });
    await newUser.save();
    res.send("User Registered Successfully");
  } catch (error) {
    res.status(400).send("Error registering user :" + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordMatch = await user.validatePassword(password);
    if (!isPasswordMatch) {
      throw new Error("Invalid credentials");
    }

    // create JWT token
    const token = await user.getJwtToken();
    // Add JWT token to cookie and send response back to client
    res.cookie("token", token, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    }); // expires in 1 day
    res.status(200).send("Login Successful");
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

authRouter.post('/logout', (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("Logout successfully");
});

module.exports = authRouter;