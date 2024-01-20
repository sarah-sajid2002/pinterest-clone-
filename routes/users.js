const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/pinterestClone");
const plm = require("passport-local-mongoose");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    minlength: 12, // You can adjust the minimum password length
  },
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
  dp: {
    type: String, // You can store the URL or file path of the profile picture
  },
  coverPhoto: {
    type: String, // You can store the URL or file path of the profile picture
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});
userSchema.plugin(plm);
module.exports = mongoose.model("users", userSchema);
