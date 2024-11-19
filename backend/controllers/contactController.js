const BrokerContact = require("../models/brokerContactModel");
const ServiceContact = require("../models/serviceContactModel");
const LandlordContact = require("../models/landlordContactModel");
const TenantContact = require("../models/tenantContactModel");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

exports.getAllContacts = catchAsync(async (req, res, next) => {
  const [brokers, services, landlords, tenants] = await Promise.all([
    BrokerContact.find({ user: req.user.id }),
    ServiceContact.find({ user: req.user.id }),
    LandlordContact.find({ user: req.user.id }),
    TenantContact.find({ user: req.user.id }),
  ]);

  res.status(200).json({
    status: "success",
    data: {
      brokers,
      services,
      landlords,
      tenants,
    },
  });
});
