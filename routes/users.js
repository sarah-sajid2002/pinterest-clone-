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
    minlength: 6, // You can adjust the minimum password length
  },
  categories: {
    type: String,
  },
  description: {
    type: String,
  },
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
  dp: {
    type: String, // You can store the URL or file path of the profile picture
    default: "https://i.pngimg.me/thumb/f/350/comdlpng6957535.jpg",
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
