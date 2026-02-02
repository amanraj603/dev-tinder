const express = require('express');
const userRouter = express.Router();
const userAuth = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const user = require('../models/user');
const SAFE_USER_DATA = "firstName lastName photoUrl age gender about skills";

userRouter.get("/user/request", userAuth, async (req,res)=>{
    try {
        const loggedInUser = req.user;

        const connectionReq = await ConnectionRequest.find({
            recieverId: loggedInUser._id,
            status: "interested"
        }).populate("senderId", SAFE_USER_DATA);
        // }).populate("senderId", ["firstName", "lastName", "photoUrl", "age", "gender", "about", "skills"]);   also writeen like this
        if(connectionReq.length == 0) {
            res.status(200).send("No connection request found.");
        }
        res.send(connectionReq);
        
    } catch (err) {
        res.status(400).send("ERROR :- ", err.message);
    }
});

userRouter.get("/user/connection", userAuth, async (req,res)=>{
    try {
        const loggedInUser = req.user;
        const connectedUser = await ConnectionRequest.find({
            $or: [
                { senderId: loggedInUser._id, status: "accepted" },
                { recieverId: loggedInUser._id, status: "accepted" }
            ]
        })
        .populate("recieverId", SAFE_USER_DATA)
        .populate("senderId", SAFE_USER_DATA);
        if(connectedUser.length == 0) {
           return res.status(200).send("No connected users found.");
        }
        const connectedUsersData = connectedUser.map(user => {
            if(user.recieverId._id.toString() ===  loggedInUser._id.toString()) {
                return user.senderId;
            }
            return user.recieverId;
        });
        res.send({
            data : connectedUsersData,
            message : "Connected users fetched successfully"
        });
    } catch (error) {
        res.status(400).send("ERROR :- ", error.message);
    }
});

userRouter.get("/user/feed", userAuth, async (req,res)=>{
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { senderId: loggedInUser._id },
                { recieverId: loggedInUser._id }
            ]
        }).select("senderId recieverId");

        const hideUsersFromFeed = new Set();
        hideUsersFromFeed.add(loggedInUser._id.toString());
        connectionRequest.map(user => {
            hideUsersFromFeed.add(user.senderId.toString());
            hideUsersFromFeed.add(user.recieverId.toString());
        })

        const allUsers = await user.find({
            _id: { $nin: Array.from(hideUsersFromFeed) }
        }).select(SAFE_USER_DATA).skip(skip).limit(limit);

        res.send(allUsers);
    } catch (error) {
        res.status(400).send("ERROR :- ", error.message);
    }
});


module.exports = userRouter;