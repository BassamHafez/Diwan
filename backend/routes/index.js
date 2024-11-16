const authRoutes = require("../routes/authRoutes");
const compoundRoutes = require("../routes/compoundRoutes");
const estateRoutes = require("../routes/estateRoutes");

const mountRoutes = (app) => {
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/compounds", compoundRoutes);
  app.use("/api/v1/estates", estateRoutes);
};

module.exports = mountRoutes;
