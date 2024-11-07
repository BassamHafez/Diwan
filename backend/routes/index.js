const authRoutes = require("../routes/authRoutes");

const mountRoutes = (app) => {
  app.use("/api/v1/auth", authRoutes);
};

module.exports = mountRoutes;
