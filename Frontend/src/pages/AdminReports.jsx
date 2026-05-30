import { useEffect, useState } from "react";

import AdminLayout from "../layouts/AdminLayout";

import api from "../services/api";

const AdminReports = () => {
  const [stats, setStats] = useState({});

  const [priorityReport, setPriorityReport] = useState([]);

  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get("/task/reports");

      setStats(response.data.stats);

      setPriorityReport(response.data.priorityReport);

      setTopUsers(response.data.topUsers);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8 text-white min-h-screen bg-black">
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-8 rounded-3xl mb-10">
          <h1 className="text-5xl font-bold">Reports & Analytics 📊</h1>

          <p className="mt-4 text-lg">
            Platform insights and performance metrics
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          <div className="bg-gray-900 p-6 rounded-2xl">
            <h3>Total Users</h3>
            <p className="text-4xl font-bold mt-3">{stats.totalUsers}</p>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl">
            <h3>Total Tasks</h3>
            <p className="text-4xl font-bold mt-3">{stats.totalTasks}</p>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl">
            <h3>Completed Tasks</h3>
            <p className="text-4xl font-bold text-green-400 mt-3">
              {stats.completedTasks}
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl">
            <h3>Overdue Tasks</h3>
            <p className="text-4xl font-bold text-red-400 mt-3">
              {stats.overdueTasks}
            </p>
          </div>
        </div>

        {/* PRIORITY REPORT */}
        <div className="bg-gray-900 rounded-3xl p-8 mb-10">
          <h2 className="text-3xl font-bold mb-6">Tasks by Priority</h2>

          {priorityReport.map((item) => (
            <div
              key={item._id}
              className="flex justify-between border-b border-gray-800 py-4"
            >
              <span className="capitalize">{item._id}</span>

              <span>{item.count}</span>
            </div>
          ))}
        </div>
        {/* TOP USERS */}
        <div className="bg-gray-900 rounded-3xl p-8">
          <h2 className="text-3xl font-bold mb-6">Top Active Users 🏆</h2>

          {topUsers.length === 0 ? (
            <p className="text-gray-400">No users found</p>
          ) : (
            topUsers.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b border-gray-800 py-4"
              >
                <div>
                  <p className="font-semibold text-lg">{item.user?.username}</p>

                  <p className="text-gray-400 text-sm">{item.user?.email}</p>
                </div>

                <span className="bg-blue-500 px-4 py-2 rounded-xl">
                  {item.totalTasks} Tasks
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
