const express = require('express');
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:recieverId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const recieverId = req.params.recieverId;
    const status = req.params.status;
    if(loggedInUser == recieverId){
      throw new Error("Can't send request to yourself");
    }

    const allowedStatus = ["ignored", "interested"];

    if(!allowedStatus.includes(status)){
      throw new Error(`Invalid status Type ${status}`);
    }

    const user = await User.findById(recieverId);
    if(!user){
      throw new Error("User not exist");
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or:[
        {senderId: loggedInUser, recieverId},
        {senderId: recieverId, recieverId: loggedInUser}
      ]
    })
    if(existingConnectionRequest){
      throw new Error("Connection Request already exist");
    }

    const connectRequest = new ConnectionRequest({
      senderId: loggedInUser, 
      recieverId,
      status
    })
    await connectRequest.save();
    res.json({
      message: 'Connect Request save successfully!'
    })
  } catch (error) {
    res.status(400).send("ERROR :- "+ error.message);
  }
});
requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const {status, requestId} = req.params;
    const loggedInUser = req.user;

    const allowedStatus = ["accepted", "rejected"];
    if(!allowedStatus.includes(status)){
      throw new Error("Status not valid");
    }  

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      recieverId: loggedInUser._id,
      status: "interested"
    })
    if(!connectionRequest){
      throw new Error("Connection Request not found");
    }

    connectionRequest.status = status;
    await connectionRequest.save();
    
    res.status(200).send(`connection ${status} successfully!`);
  } catch (error) {
    res.status(400).send("ERROR :- ", error.message);
  }
});

module.exports = requestRouter;