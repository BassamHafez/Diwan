const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Account must have an owner"],
    },
    name: String,
    phone: String,
    address: String,
    region: String,
    city: String,
    commercialRecord: String,
    taxNumber: String,
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        permissions: {
          type: [String],
          default: [],
        },
      },
    ],
    features: {
      type: [String],
      default: ["allowedUsers", "allowedCompounds", "isFavoriteAllowed"],
    },
    allowedUsers: {
      type: Number,
      default: 0,
    },
    allowedCompounds: {
      type: Number,
      default: 0,
    },
    isFavoriteAllowed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
