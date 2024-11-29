const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema(
  {
    estate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Estate",
      required: true,
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TenantContact",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalAmount: {
      type: Number,
      min: 1,
      required: true,
    },
    paymentPeriodValue: {
      type: Number,
      min: 1,
      required: true,
    },
    paymentPeriodUnit: {
      type: String,
      enum: ["day", "week", "month", "year"],
      required: true,
    },
    // status: {
    //   type: String,
    //   enum: ["active", "completed", "canceled", "upcoming"],
    //   default: "upcoming",
    // },
    isCanceled: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Contract = mongoose.model("Contract", contractSchema);

module.exports = Contract;
