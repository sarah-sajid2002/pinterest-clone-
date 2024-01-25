const mongoose = require("mongoose");

// Post Model
const postSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  likes: [
    {
      type: Array,
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", postSchema);
