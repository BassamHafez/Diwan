const ServiceContact = require("../models/serviceContactModel");
const factory = require("./handlerFactory");

const serviceFields = "name phone phone2";

exports.getAllServiceContacts = factory.getAll(
  ServiceContact,
  [],
  serviceFields
);
exports.getServiceContact = factory.getOne(ServiceContact, [], serviceFields);
exports.createServiceContact = factory.createOne(ServiceContact);
exports.updateServiceContact = factory.updateOne(ServiceContact);
exports.deleteServiceContact = factory.deleteOne(ServiceContact);
