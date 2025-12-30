const mongoose = require("mongoose");
const validator = require("validator");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: String,
    emailId: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: true,
      validate(value){
        if(!validator.isEmail(value)){
          throw new Error("Email is not valid");
        }
      }
    },
    password: {
      type: String,
      required: true,
      validate(value){
        if(!validator.isStrongPassword(value))
            throw new Error("Password is not strong enough");
      }
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data not valide");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/048/216/761/non_2x/modern-male-avatar-with-black-hair-and-hoodie-illustration-free-png.png",
        validator(value){
            if(!validator.isURL(value)){
                throw new Error("Photo URL is not valid");
            }
        }
    },
    about: {
      type: String,
      default: "Hey there! I am using DevTinder.",
    },
    skills: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);