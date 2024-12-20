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
        permittedCompounds: {
          type: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Compound",
            },
          ],
          default: [],
        },
      },
    ],
    allowedUsers: {
      type: Number,
      default: 0,
    },
    allowedCompounds: {
      type: Number,
      default: 1,
    },
    allowedEstates: {
      type: Number,
      default: 5,
    },
    maxEstatesInCompound: {
      type: Number,
      default: 3,
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
