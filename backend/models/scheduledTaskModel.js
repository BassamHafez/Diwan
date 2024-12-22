const mongoose = require("mongoose");

const scheduledTaskSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "CONTRACT_EXPIRATION",
        "CONTRACT_ACTIVATION",
        "REVENUE_REMINDER",
        "EXPENSE_REMINDER",
      ],
      required: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
    contract: mongoose.Schema.Types.ObjectId,
    estate: mongoose.Schema.Types.ObjectId,
    revenue: mongoose.Schema.Types.ObjectId,
    expense: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true }
);

scheduledTaskSchema.index({ isDone: 1 });

const ScheduledTask = mongoose.model("ScheduledTask", scheduledTaskSchema);

module.exports = ScheduledTask;
