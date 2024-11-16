const authRoutes = require("../routes/authRoutes");
const compoundRoutes = require("../routes/compoundRoutes");
const estateRoutes = require("../routes/estateRoutes");
const contactRoutes = require("../routes/contactRoutes");

const mountRoutes = (app) => {
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/compounds", compoundRoutes);
  app.use("/api/v1/estates", estateRoutes);
  app.use("/api/v1/contacts", contactRoutes);
};

module.exports = mountRoutes;
