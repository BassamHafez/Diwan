const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    arTitle: {
      type: String,
      required: true,
    },
    enTitle: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    originalPrice: {
      type: Number,
      min: 0,
      required: true,
    },
    features: [
      {
        label: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Package = mongoose.model("Package", packageSchema);

module.exports = Package;