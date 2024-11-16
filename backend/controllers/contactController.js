const Contact = require("../models/contactModel");
const factory = require("./handlerFactory");

exports.setUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.filterUserContacts = (req, res, next) => {
  if (req.user.role !== "admin") req.query.user = req.user.id;
  next();
};

exports.getAllContacts = factory.getAll(Contact);
exports.getContact = factory.getOne(Contact);
exports.createContact = factory.createOne(Contact);
exports.updateContact = factory.updateOne(Contact);
exports.deleteContact = factory.deleteOne(Contact);
