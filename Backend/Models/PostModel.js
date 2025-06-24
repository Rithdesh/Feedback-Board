const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  caption: { type: String, required: true },
  image: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required: true }, 
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);
