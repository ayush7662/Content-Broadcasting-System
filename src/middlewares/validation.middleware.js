const { body, param, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      msg: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .optional()
    .isIn(["principal", "teacher"])
    .withMessage("Role must be principal or teacher"),
  handleValidationErrors,
];

const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

const uploadValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("subject").trim().notEmpty().withMessage("Subject is required"),
  body("start_time")
    .optional()
    .isISO8601()
    .withMessage("Start time must be a valid date"),
  body("end_time")
    .optional()
    .isISO8601()
    .withMessage("End time must be a valid date"),
  handleValidationErrors,
];

const approveRejectValidation = [
  param("id").isInt().withMessage("Content ID must be an integer"),
  handleValidationErrors,
];

const rejectValidation = [
  param("id").isInt().withMessage("Content ID must be an integer"),
  body("reason").trim().notEmpty().withMessage("Rejection reason is required"),
  handleValidationErrors,
];

module.exports = {
  registerValidation,
  loginValidation,
  uploadValidation,
  approveRejectValidation,
  rejectValidation,
};

