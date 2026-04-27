const rateLimit = require("express-rate-limit");

const liveApiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    msg: "Too many requests from this IP, please try again after a minute",
  },
});

module.exports = { liveApiLimiter };

