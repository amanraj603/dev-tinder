const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    try {
      // Read the token from the cookies
      const { token } = req.cookies;
      if (!token) {
        throw new Error("Token not present");
      }
      const decodedMsg = await jwt.verify(token, "DEV@TINDER$790");
      // Find the user by the userId
      const user = await User.findById(decodedMsg.userId);
      if(!user){
        throw new Error("User not found!");
      }
      // sending user to the next middleware
      req.user = user;
      next();
    } catch (error) {
        res.status(401).send("ERROR : " + error.message);
    }
}

module.exports = userAuth;