const BrokerContact = require("../models/brokerContactModel");
const ServiceContact = require("../models/serviceContactModel");
const LandlordContact = require("../models/landlordContactModel");
const TenantContact = require("../models/tenantContactModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllContacts = catchAsync(async (req, res, next) => {
  const accountId = req.user.account;
  const collections = [
    BrokerContact,
    ServiceContact,
    LandlordContact,
    TenantContact,
  ];

  const contactPromises = collections.map((collection) =>
    collection.find({ account: accountId }).lean()
  );

  const contacts = await Promise.all(contactPromises);

  const allContacts = contacts.flat();

  res.status(200).json({
    status: "success",
    data: allContacts,
  });
});
