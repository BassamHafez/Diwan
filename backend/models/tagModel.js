const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  tags: {
    type: [String],
    default: [],
  },
});

const Tag = mongoose.model("Tag", tagSchema);

module.exports = Tag;
