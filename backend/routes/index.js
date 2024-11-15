const authRoutes = require("../routes/authRoutes");
const compoundRoutes = require("../routes/compoundRoutes");

const mountRoutes = (app) => {
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/compounds", compoundRoutes);
};

module.exports = mountRoutes;
