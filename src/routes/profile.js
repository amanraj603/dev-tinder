const express = require('express');
const userAuth = require("../middlewares/auth");
const { validateEditProfileData } = require('../utils/validationFunc');

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send("Error fetching profile: " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try{
        const isvalid = validateEditProfileData(req);
        if(!isvalid){
            throw new Error("Invalid Edit Request");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]);
        await loggedInUser.save();
        res.send("Update successfully!");
    } 
    catch(err){
        res.send("ERROR : "+ err.message);
    }
});

module.exports = profileRouter;