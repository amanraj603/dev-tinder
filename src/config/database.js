const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(
      "mongodb+srv://imamanraj_07:amanraj123@microservices.rw9ew0v.mongodb.net/devTinder"
    );
}

module.exports = connectDB;