const mongoose = require("mongoose");

const serviceContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    phone2: String,
    notes: String,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    contactType: {
      type: String,
      enum: ["service"],
      default: "service",
    },
  },
  { timestamps: true }
);

const ServiceContact = mongoose.model("ServiceContact", serviceContactSchema);

module.exports = ServiceContact;