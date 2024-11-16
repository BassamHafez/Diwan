const mongoose = require("mongoose");

const compoundSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: String,
    region: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    neighborhood: {
      type: String,
      default: "not specified",
    },
    image: {
      type: String,
      default: "/compounds/default-compound.png",
    },
    tags: [String],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    broker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
    },
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
    },
  },
  { timestamps: true }
);

const Compound = mongoose.model("Compound", compoundSchema);

module.exports = Compound;
