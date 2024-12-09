const mongoose = require("mongoose");

const revenueSchema = new mongoose.Schema(
  {
    note: String,
    amount: {
      type: Number,
      min: 0,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      // مستحقات - عمولة إضافية - السعي - مستحق إضافي - أخرى
      enum: ["dues", "extra-fee", "commission", "add-due", "other"],
      default: "dues",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "canceled"],
      default: "pending",
    },
    paidAt: Date,
    paymentMethod: {
      type: String,
      enum: ["cash", "bank-transfer", "online"],
    },
    contract: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contract",
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TenantContact",
    },
    estate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Estate",
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
  },
  { timestamps: true }
);

const Revenue = mongoose.model("Revenue", revenueSchema);

module.exports = Revenue;
