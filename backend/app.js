const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const compression = require("compression");
const cors = require("cors");

const ApiError = require("./utils/ApiError");
const startCronJobs = require("./cronJobs");
const ensureDirectories = require("./utils/createStaticFiles");
const globalErrorHandler = require("./controllers/errorController");
const mountRoutes = require("./routes");

const app = express();

// app.set("trust proxy", true);
// app.enable("trust proxy");

startCronJobs();
ensureDirectories();
// Serve static files
app.use(express.static(path.join(__dirname, "uploads")));

// set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors());
app.options("*", cors());

// development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// limit requests from same IP
const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  keyGenerator: (req) => {
    return req.ip; // Customize key generation to ensure correct IP is used
  },
  message: "Too many requests from this IP, Please try again in an hour!",
});
app.use("/api", limiter);

// Body parser
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
// app.use(hpp());
app.use(
  hpp({
    whitelist: ["price"],
  })
);

// Compress texts (requests) before sent to client
app.use(compression());

// ROUTES
mountRoutes(app);

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find ${req.originalUrl} on server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
