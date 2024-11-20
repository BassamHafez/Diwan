const mongoose = require("mongoose");

const landlordContactSchema = new mongoose.Schema(
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
      enum: ["landlord"],
      default: "landlord",
    },
  },
  { timestamps: true }
);

const LandlordContact = mongoose.model(
  "LandlordContact",
  landlordContactSchema
);

module.exports = LandlordContact;
