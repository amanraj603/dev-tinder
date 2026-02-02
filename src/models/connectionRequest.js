const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true
    },
    recieverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status:{
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is invalid status`
        }
    }
},{
    timestamps: true
})

module.exports = new mongoose.model("ConnectionRequestModel", connectionRequestSchema);
