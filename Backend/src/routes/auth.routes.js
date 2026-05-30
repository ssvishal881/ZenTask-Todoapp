const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const router = express.Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout", authController.logoutUser);
router.get("/profile", authMiddleware.authUser, authController.getProfile);
router.put(
  "/upload-profile",
  authMiddleware.authUser,
  upload.single("profileImage"),
  authController.uploadProfileImage,
);
router.put(
  "/update-profile",
  authMiddleware.authUser,
  authController.updateProfile,
);

module.exports = router;
