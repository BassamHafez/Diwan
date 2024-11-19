const mongoose = require("mongoose");

const tenantContactSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["individual", "organization"],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    phone2: String,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    nationalId: String,
    address: String,
    email: String,
    commercialRecord: String,
    taxNumber: String,
  },
  { timestamps: true }
);

const TenantContact = mongoose.model("TenantContact", tenantContactSchema);

module.exports = TenantContact;
