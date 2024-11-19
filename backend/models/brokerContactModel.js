const mongoose = require("mongoose");

const brokerContactSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);

const BrokerContact = mongoose.model("BrokerContact", brokerContactSchema);

module.exports = BrokerContact;
