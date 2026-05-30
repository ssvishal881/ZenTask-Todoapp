const express = require("express");
const taskModel = require("../models/task.model");
const mongoose = require("mongoose");
const userModel = require("../models/user.model");

async function createTask(req, res) {
  try {
    console.log(req.body);

    const { title, priority, dueDate } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const validPriorities = ["low", "medium", "high"];

    if (!validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Invalid priority",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(dueDate);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: "Due date cannot be in past",
      });
    }

    const task = await taskModel.create({
      title,
      priority,
      dueDate,
      user: req.user.id,
    });
    const io = req.app.get("io");

    io.emit("notification", {
      message: `📌 New Task Created: ${task.title}`,
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (err) {
    console.log("CREATE TASK ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Error creating task",
    });
  }
}

async function getTasks(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;
    const filter = {
      isDeleted: false,
    };

    //Role-based logic
    if (req.user.role !== "admin") {
      filter.user = req.user.id;
    }

    const task = await taskModel.find(filter).skip(skip).limit(Number(limit));

    const total = await taskModel.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      message: "Tasks fetched succesfully",
      task: task,
      page,
      totalTask: total,
      totalPages: totalPages,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error getting task",
    });
  }
}

async function getMyTasks(req, res) {
  try {
    // PAGINATION
    const page = parseInt(req.query.page) || 1;

    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    // QUERY PARAMS
    const { status, priority, sortBy, search } = req.query;

    // FILTER
    const filter = {
      user: req.user.id,

      isDeleted: false,
    };

    // SEARCH
    if (search) {
      filter.title = {
        $regex: search,

        $options: "i",
      };
    }

    // STATUS FILTER
    if (status) {
      filter.status = status;
    }

    // PRIORITY FILTER
    if (priority) {
      filter.priority = priority;
    }

    // SORT
    let sortOptions = {};

    if (sortBy === "dueDate") {
      sortOptions.dueDate = 1;
    } else if (sortBy === "-dueDate") {
      sortOptions.dueDate = -1;
    }

    if (sortBy === "priority") {
      sortOptions.priority = 1;
    } else if (sortBy === "-priority") {
      sortOptions.priority = -1;
    }

    // TOTAL AFTER FILTER
    const total = await taskModel.countDocuments(filter);

    const totalPages = Math.ceil(total / limit);

    // FETCH TASKS
    const tasks = await taskModel
      .find(filter)

      .sort(sortOptions)

      .skip(skip)

      .limit(limit)

      .populate("user", "username email");

    return res.status(200).json({
      success: true,

      message: "Tasks fetched successfully",

      tasks,

      page,

      total,

      totalPages,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,

      message: "Error getting tasks",
    });
  }
}

async function getUserTask(req, res) {
  try {
    const { userId } = req.params;

    if (req.user.id !== userId) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    const filter = {
      user: userId,
      isDeleted: false,
    };

    const tasks = await taskModel
      .find(filter)
      .sort({ dueDate: 1 })
      .limit(6)
      .populate("user", "username email");

    return res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      tasks,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error getting task",
    });
  }
}

async function updateTask(req, res) {
  try {
    const { title, status, priority, dueDate } = req.body;
    const { taskId } = req.params;
    const userId = req.user.id;

    const task = await taskModel.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Tasks does not exist",
        success: false,
      });
    }

    if (task.user.toString() !== userId.toString()) {
      return res.status(404).json({
        success: false,
        message: "Unauthorize",
      });
    }

    const updatedTask = await taskModel.findByIdAndUpdate(
      taskId,
      { $set: { title, status, priority, dueDate } },
      { returnDocument: "after" },
    );
    return res.status(200).json({
      success: true,
      message: "Task Updated successfully",
      task: {
        id: updatedTask.id,
        title: updatedTask.title,
        status: updatedTask.status,
        user: updatedTask.user,
        priority: updatedTask.priority,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error updating Task",
    });
  }
}

async function deleteTask(req, res) {
  try {
    const userId = req.user.id;
    const { taskId } = req.params;

    const task = await taskModel.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Tasks does not exist",
        success: false,
      });
    }

    if (task.user.toString() !== userId.toString()) {
      return res.status(404).json({
        success: false,
        message: "Unauthorize",
      });
    }

    await taskModel.findByIdAndUpdate(taskId, { isDeleted: true });
    const io = req.app.get("io");

    io.emit("notification", {
      message: `🗑️ Task Deleted`,
    });
    return res.status(200).json({
      success: true,
      message: "Task deleted succesfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error deleting Task",
    });
  }
}

async function getMyStats(req, res) {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const total = await taskModel.countDocuments({ user: userId });

    const complete = await taskModel.countDocuments({
      user: userId,
      status: "completed",
    });
    const pending = await taskModel.countDocuments({
      user: userId,
      status: "pending",
    });

    // We comment below code due to we create stats method in different way using countDocuments
    // const stats = await taskModel.aggregate([
    //   {
    //     $match: { user: userId },
    //   },
    //   {
    //     $group: {
    //       _id: "$status",
    //       count: { $sum: 1 },
    //     },
    //   },
    // ]);
    return res.status(200).json({
      success: true,
      message: "Your stats",
      total: total,
      completed: complete,
      pending: pending,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error in getting stats",
    });
  }
}

async function markCompleted(req, res) {
  try {
    const userId = req.user.id;

    const task = await taskModel.updateMany(
      {
        user: userId,
        status: { $ne: "completed" }, //ne = not equal
      },
      { $set: { status: "completed" } },
    );

    const io = req.app.get("io");

    io.emit("notification", {
      message: `✅ Task Completed`,
    });
    return res.status(200).json({
      success: true,
      message: "All tasks marked as completed",
      modifiedCount: task.modifiedCount,
      task,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error while updating task",
    });
  }
}

async function getOverDueTask(req, res) {
  try {
    const tasks = await taskModel
      .find({
        user: req.user.id,
        dueDate: { $lt: new Date() },
        status: { $ne: "completed" },
      })
      .sort({ dueDate: 1 });

    return res.status(200).json({
      success: true,
      message: "overDue task fetched successfully",
      overdueTask: tasks,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error in geeting overDue task",
    });
  }
}

async function getUsers(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    const users = await userModel.find().skip(skip).limit(limit);

    const totalUsers = await userModel.countDocuments();

    const totalPages = Math.ceil(totalUsers / limit);

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users,
      total: totalUsers,
      totalPages,
      page,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error fetching users",
    });
  }
}

async function deleteAnyTask(req, res) {
  try {
    const { taskId } = req.params;

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin can only delete any task",
      });
    }

    const task = await taskModel.findByIdAndUpdate(
      taskId,
      {
        isDeleted: true,
      },
      {
        new: true,
      },
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task does not exist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (err) {
    console.log("DELETE ADMIN ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function getNotifications(req, res) {
  try {
    const tasks = await taskModel.find({
      user: req.user.id,
      isDeleted: false,
    });

    const today = new Date();

    // OVERDUE
    const overdue = tasks.filter(
      (task) => task.status !== "completed" && new Date(task.dueDate) < today,
    ).length;

    // PENDING
    const pending = tasks.filter((task) => task.status === "pending").length;

    // COMPLETED
    const completed = tasks.filter(
      (task) => task.status === "completed",
    ).length;

    return res.status(200).json({
      success: true,

      notifications: [
        {
          type: "overdue",

          message: `⚠️ You have ${overdue} overdue tasks`,
        },

        {
          type: "pending",

          message: `📌 ${pending} tasks pending`,
        },

        {
          type: "completed",

          message: `✅ ${completed} tasks completed`,
        },
      ],
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,

      message: "Error fetching notifications",
    });
  }
}

async function getAdminNotifications(req, res) {
  try {
    const today = new Date();

    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    // NEW USERS TODAY
    const newUsersToday = await userModel.countDocuments({
      createdAt: { $gte: startOfDay },
    });

    // TASKS CREATED TODAY
    const tasksCreatedToday = await taskModel.countDocuments({
      createdAt: { $gte: startOfDay },
      isDeleted: false,
    });

    // COMPLETED TASKS
    const completedToday = await taskModel.countDocuments({
      status: "completed",
      isDeleted: false,
    });

    // OVERDUE TASKS
    const overdueTasks = await taskModel.countDocuments({
      dueDate: { $lt: new Date() },
      status: { $ne: "completed" },
      isDeleted: false,
    });

    return res.status(200).json({
      success: true,

      notifications: [
        {
          type: "user",
          message: `👤 ${newUsersToday} new users joined today`,
        },

        {
          type: "task",
          message: `📌 ${tasksCreatedToday} tasks created today`,
        },

        {
          type: "completed",
          message: `✅ ${completedToday} tasks completed`,
        },

        {
          type: "overdue",
          message: `⚠️ ${overdueTasks} overdue tasks`,
        },
      ],
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Error fetching admin notifications",
    });
  }
}

async function getAdminAnalytics(req, res) {
  try {
    const tasks = await taskModel.find({
      isDeleted: false,
    });

    const completed = tasks.filter(
      (task) => task.status === "completed",
    ).length;

    const pending = tasks.filter((task) => task.status === "pending").length;

    const overdue = tasks.filter(
      (task) =>
        task.status !== "completed" && new Date(task.dueDate) < new Date(),
    ).length;

    // CHART DATA
    const chartData = [
      {
        name: "Completed",

        value: completed,
      },

      {
        name: "Pending",

        value: pending,
      },

      {
        name: "Overdue",

        value: overdue,
      },
    ];

    // RECENT TASKS
    const recentActivities = await taskModel

      .find({
        isDeleted: false,
      })

      .sort({
        createdAt: -1,
      })

      .limit(5)

      .populate("user", "username");

    return res.status(200).json({
      success: true,

      chartData,

      recentActivities,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,

      message: "Error fetching admin analytics",
    });
  }
}

async function getAdminDashboardStats(req, res) {
  try {
    // TOTAL USERS
    const totalUsers = await userModel.countDocuments();

    // TOTAL TASKS
    const totalTasks = await taskModel.countDocuments({
      isDeleted: false,
    });

    // COMPLETED
    const completedTasks = await taskModel.countDocuments({
      status: "completed",

      isDeleted: false,
    });

    // OVERDUE
    const overdueTasks = await taskModel.countDocuments({
      dueDate: {
        $lt: new Date(),
      },

      status: {
        $ne: "completed",
      },

      isDeleted: false,
    });

    // ACTIVE USERS
    const activeUsers = await taskModel.distinct("user");

    // COMPLETION %
    const completionRate =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    return res.status(200).json({
      success: true,

      stats: {
        totalUsers,

        totalTasks,

        completedTasks,

        overdueTasks,

        activeUsers: activeUsers.length,

        completionRate,
      },
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,

      message: "Error fetching admin dashboard stats",
    });
  }
}

async function getUserProfileAdmin(req, res) {
  try {
    const { userId } = req.params;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const totalTasks = await taskModel.countDocuments({
      user: userId,
      isDeleted: false,
    });

    const completedTasks = await taskModel.countDocuments({
      user: userId,
      status: "completed",
      isDeleted: false,
    });

    const overdueTasks = await taskModel.countDocuments({
      user: userId,
      status: { $ne: "completed" },
      dueDate: { $lt: new Date() },
      isDeleted: false,
    });

    return res.status(200).json({
      success: true,

      user,

      stats: {
        totalTasks,
        completedTasks,
        overdueTasks,
      },
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Error fetching user profile",
    });
  }
}

async function getReports(req, res) {
  try {
    // OVERVIEW STATS
    const totalUsers = await userModel.countDocuments();

    const totalTasks = await taskModel.countDocuments({
      isDeleted: false,
    });

    const completedTasks = await taskModel.countDocuments({
      status: "completed",
      isDeleted: false,
    });

    const overdueTasks = await taskModel.countDocuments({
      dueDate: { $lt: new Date() },
      status: { $ne: "completed" },
      isDeleted: false,
    });

    // COMPLETION %
    const completionPercentage =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // PRIORITY REPORT
    const priorityReport = await taskModel.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    // TOP ACTIVE USERS
    const topUsers = await taskModel.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: "$user",
          totalTasks: { $sum: 1 },
        },
      },
      {
        $sort: {
          totalTasks: -1,
        },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
    ]);

    // WEEKLY TREND
    const weeklyTrend = await taskModel.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      {
        $limit: 7,
      },
    ]);

    return res.status(200).json({
      success: true,

      stats: {
        totalUsers,
        totalTasks,
        completedTasks,
        overdueTasks,
        completionPercentage,
      },

      priorityReport,

      topUsers,

      weeklyTrend,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Error fetching reports",
    });
  }
}

module.exports = {
  createTask, // (C)
  getTasks, // For Admin // (R)
  getMyTasks,
  getUserTask,
  updateTask, // (U)
  deleteTask, // (D)
  getMyStats,
  markCompleted,
  getOverDueTask,
  getUsers, //For Admin
  deleteAnyTask, // For Admin
  getNotifications,
  getAdminAnalytics,
  getAdminDashboardStats,
  getAdminNotifications,
  getUserProfileAdmin,
  getReports,
};
