const Favorite = require("../models/favoriteModel");
const factory = require("./handlerFactory");

exports.setUserId = (req, res, next) => {
  req.body.user = req.user.id;
  next();
};

exports.filterUserFavorites = (req, res, next) => {
  req.query.user = req.user.id;
  next();
};

const estatePopOptions = [
  {
    path: "estate",
    select:
      "name description tags status address region city neighborhood image compound",
  },
];

exports.getAllFavorites = factory.getAll(Favorite, estatePopOptions, "estate");
exports.favoriteEstate = factory.createOne(Favorite);
exports.unfavoriteEstate = factory.deleteOne(Favorite);
