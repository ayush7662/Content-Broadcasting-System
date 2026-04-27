const express = require("express");
const router = express.Router();

const contentController = require("../controllers/content.controller");
const auth = require("../middlewares/auth.Middleware");
const roleCheck = require("../middlewares/role.Middleware");
const upload = require("../utils/upload");
const { liveApiLimiter } = require("../middlewares/rateLimit.middleware");
const {
  uploadValidation,
  approveRejectValidation,
  rejectValidation,
} = require("../middlewares/validation.middleware");

// Teacher Routes
router.post(
  "/upload",
  auth,
  roleCheck("teacher"),
  upload.single("file"),
  uploadValidation,
  contentController.upload
);

router.get("/my-uploads", auth, roleCheck("teacher"), contentController.myUploads);

// Principal Routes
router.get("/all", auth, roleCheck("principal"), contentController.getAll);
router.get("/pending", auth, roleCheck("principal"), contentController.getPending);
router.put(
  "/approve/:id",
  auth,
  roleCheck("principal"),
  approveRejectValidation,
  contentController.approve
);
router.put(
  "/reject/:id",
  auth,
  roleCheck("principal"),
  rejectValidation,
  contentController.reject
);

// Public Broadcasting Route (Rate Limited) - MUST be before /:id
router.get("/live/:teacherId", liveApiLimiter, contentController.live);

// Shared/General Routes - MUST be after specific routes
router.get("/:id", auth, contentController.getById);
router.delete("/:id", auth, contentController.delete);

module.exports = router;
