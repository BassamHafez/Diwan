const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    note: {
      type: String,
      trim: true,
    },
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
      enum: ["purchases", "maintenance", "other"],
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
    estate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Estate",
    },
    compound: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Compound",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
