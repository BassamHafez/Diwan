const mongoose = require("mongoose");

const estateSchema = new mongoose.Schema(
  {
    compound: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Compound",
    },
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
      default: "/estates/default-estate.png",
    },
    price: {
      type: Number,
      min: 1,
      required: true,
    },
    area: {
      type: Number,
      min: 1,
      required: true,
    },
    tags: [String],
    electricityAccountNumber: {
      type: String,
      // match: /^\d{11}$/, // 11 digits
    },
    waterAccountNumber: {
      type: String,
      // match: /^\d{10}$/, // 10 digits
    },
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

const Estate = mongoose.model("Estate", estateSchema);

module.exports = Estate;
