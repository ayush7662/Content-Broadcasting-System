const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const auth = require("../middlewares/auth.Middleware");
const {
  registerValidation,
  loginValidation,
} = require("../middlewares/validation.middleware");

router.post("/register", registerValidation, authController.register);
router.post("/login", loginValidation, authController.login);
router.get("/me", auth, authController.me);

module.exports = router;
