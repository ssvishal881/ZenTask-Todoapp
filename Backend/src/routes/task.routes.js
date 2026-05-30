const express = require("express");
const taskController = require("../controllers/task.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// Create Task
router.post("/create", authMiddleware.authUser, taskController.createTask);

// Admin - All Tasks
router.get(
  "/",
  authMiddleware.authUser,
  authMiddleware.isAdmin,
  taskController.getTasks,
);

// Admin - All Users
router.get(
  "/get-users",
  authMiddleware.authUser,
  authMiddleware.isAdmin,
  taskController.getUsers,
);

// User Tasks
router.get("/my-task", authMiddleware.authUser, taskController.getMyTasks);

// Dashboard Stats
router.get("/stats", authMiddleware.authUser, taskController.getMyStats);

// Single User Tasks
router.get(
  "/user/:userId",
  authMiddleware.authUser,
  taskController.getUserTask,
);

// Update Task
router.put(
  "/update/:taskId",
  authMiddleware.authUser,
  taskController.updateTask,
);

// Delete Task
router.delete(
  "/delete/:taskId",
  authMiddleware.authUser,
  taskController.deleteTask,
);

// Admin Delete Task
router.delete(
  "/deletebyAdmin/:taskId",
  authMiddleware.authUser,
  authMiddleware.isAdmin,
  taskController.deleteAnyTask,
);

// Mark Complete
router.put(
  "/markComplete",
  authMiddleware.authUser,
  taskController.markCompleted,
);

// Overdue Tasks
router.get("/overdue", authMiddleware.authUser, taskController.getOverDueTask);

// User Notifications
router.get(
  "/notifications",
  authMiddleware.authUser,
  taskController.getNotifications,
);

// Admin Analytics
router.get(
  "/admin-analytics",
  authMiddleware.authUser,
  authMiddleware.isAdmin,
  taskController.getAdminAnalytics,
);

// Admin Dashboard Stats
router.get(
  "/admin-dashboard-stats",
  authMiddleware.authUser,
  authMiddleware.isAdmin,
  taskController.getAdminDashboardStats,
);

// Admin Notifications
router.get(
  "/admin-notifications",
  authMiddleware.authUser,
  authMiddleware.isAdmin,
  taskController.getAdminNotifications,
);

// Admin User Profile
router.get(
  "/admin/user/:userId",
  authMiddleware.authUser,
  authMiddleware.isAdmin,
  taskController.getUserProfileAdmin,
);

// Reports
router.get(
  "/reports",
  authMiddleware.authUser,
  authMiddleware.isAdmin,
  taskController.getReports,
);

module.exports = router;
