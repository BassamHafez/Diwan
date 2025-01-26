const Message = require("../models/messageModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const sendEmail = require("../utils/sendEmail");

const popOptions = [
  {
    path: "account",
    select:
      "owner name phone email address region city subscriptionEndDate isVIP createdAt",
  },
];

exports.getAllSupportMessages = factory.getAll(Message, popOptions);
exports.deleteSupportMessage = factory.deleteOne(Message);

exports.createSupportMessage = catchAsync(async (req, res, next) => {
  if (req.user) req.body.user = req.user.id;
  if (req.account) req.body.account = req.account.id;

  await Promise.all([
    Message.create(req.body),

    sendEmail(
      process.env.SUPPORT_EMAIL,
      req.body.subject || "New Support Message",
      `${req.body.name} <${req.body.email}>:\n\n${req.body.message}`
    ),
  ]);

  res.status(200).json({
    status: "success",
    message: "Message sent successfully",
  });
});

exports.updateSupportMessageStatus = catchAsync(async (req, res, next) => {
  const msgId = req.params.id;
  const { status } = req.body;

  const result = await Message.updateOne({ _id: msgId }, { status });

  if (result.modifiedCount < 1) {
    return next(new ApiError("Message not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Message status updated successfully",
  });
});
