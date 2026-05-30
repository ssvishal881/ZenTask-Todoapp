const express = require("express");
const mongoose = require("mongoose");
const taskModel = require("../models/task.model");

const getDashboard = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const filter = {
      user: userId,
      isDeleted: false,
    };

    const result = await taskModel.aggregate([
      {
        $match: filter,
      },

      {
        $group: {
          _id: null,

          total: {
            $sum: 1,
          },

          completed: {
            $sum: {
              $cond: [
                {
                  $eq: ["$status", "completed"],
                },
                1,
                0,
              ],
            },
          },

          pending: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $ne: ["$status", "completed"],
                    },
                    {
                      $gte: ["$dueDate", new Date()],
                    },
                  ],
                },
                1,
                0,
              ],
            },
          },

          overdue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $lt: ["$dueDate", new Date()],
                    },
                    {
                      $ne: ["$status", "completed"],
                    },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const stats = result[0] || {
      total: 0,
      completed: 0,
      pending: 0,
      overdue: 0,
    };

    return res.status(200).json({
      success: true,
      message: "Dashboard stats",
      stats,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Error fetching dashboard",
    });
  }
};

const getTaskPerDay = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const filter = {
      user: userId,
      isDeleted: false,
    };

    const result = await taskModel.aggregate([
      {
        $match: filter,
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
    ]);

    return res.status(200).json({
      success: true,
      message: "Task per day fetched successfully",

      tasksPerDay: result,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Error fetching tasks per day",
    });
  }
};

module.exports = {
  getDashboard,
  getTaskPerDay,
};
