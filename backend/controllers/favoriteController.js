const Favorite = require("../models/favoriteModel");
const factory = require("./handlerFactory");

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
