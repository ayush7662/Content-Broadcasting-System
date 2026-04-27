const multer = require("multer");

const errorHandler = (err, req, res, next) => {
  console.error("ERROR:", err);

  // Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ msg: "File size exceeds 10MB limit" });
    }
    return res.status(400).json({ msg: `Upload error: ${err.message}` });
  }

  if (err.message && err.message.includes("Only JPG, PNG, GIF allowed")) {
    return res.status(400).json({ msg: err.message });
  }

  // Sequelize validation errors
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      msg: "Validation error",
      errors: err.errors.map((e) => ({ field: e.path, message: e.message })),
    });
  }

  // Sequelize unique constraint errors
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      msg: "Duplicate entry",
      errors: err.errors.map((e) => ({ field: e.path, message: e.message })),
    });
  }

  // Sequelize foreign key errors
  if (err.name === "SequelizeForeignKeyConstraintError") {
    return res.status(400).json({ msg: "Invalid reference ID provided" });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ msg: "Invalid token" });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ msg: "Token expired" });
  }

  // Generic error
  return res.status(500).json({
    msg: err.message || "Internal Server Error",
  });
};

module.exports = { errorHandler };

