const express = require("express");
const router = express.Router();
const {
  getDashboard,
  getTaskPerDay,
} = require("../controllers/dashboard.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/dashboard", authMiddleware.authUser, getDashboard);
router.get("/dashboard/taskPerDay", authMiddleware.authUser, getTaskPerDay);

module.exports = router;
