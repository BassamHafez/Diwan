const mongoose = require("mongoose");

const scheduledMissionSchema = new mongoose.Schema(
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
    contractEndDate: Date,
    estate: mongoose.Schema.Types.ObjectId,
    revenue: mongoose.Schema.Types.ObjectId,
    expense: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true }
);

scheduledMissionSchema.index({ isDone: 1, scheduledAt: 1 });

const ScheduledMission = mongoose.model(
  "ScheduledMission",
  scheduledMissionSchema
);

module.exports = ScheduledMission;