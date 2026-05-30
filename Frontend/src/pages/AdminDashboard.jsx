import { useEffect, useState } from "react";

import AdminLayout from "../layouts/AdminLayout";

import AdminStatsCard from "../components/dashboard/AdminStatsCard";

import AdminCharts from "../components/dashboard/AdminCharts";

import RecentActivity from "../components/dashboard/RecentActivity";

import api from "../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,

    totalTasks: 0,

    completedTasks: 0,

    overdueTasks: 0,

    activeUsers: 0,

    completionRate: 0,
  });

  const [chartData, setChartData] = useState([]);

  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchDashboardStats();

    fetchAdminAnalytics();
  }, []);

  // FETCH STATS
  const fetchDashboardStats = async () => {
    try {
      const response = await api.get("/task/admin-dashboard-stats");

      setStats(response.data.stats);
    } catch (err) {
      console.log(err);
    }
  };

  // FETCH ANALYTICS
  const fetchAdminAnalytics = async () => {
    try {
      const response = await api.get("/task/admin-analytics");

      setChartData(response.data.chartData);

      setRecentActivities(response.data.recentActivities);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8 min-h-screen bg-black text-white">
        {/* HERO */}
        <div className="bg-gradient-to-r from-red-500 to-red-700 rounded-3xl p-10 mb-10 shadow-2xl">
          <h1 className="text-5xl font-bold">Admin Dashboard 👑</h1>

          <p className="mt-4 text-red-100 text-lg">
            Monitor platform analytics and manage productivity.
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-10">
          <AdminStatsCard title="Total Users" value={stats.totalUsers} />

          <AdminStatsCard title="Total Tasks" value={stats.totalTasks} />

          <AdminStatsCard
            title="Completed Tasks"
            value={stats.completedTasks}
          />

          <AdminStatsCard title="Overdue Tasks" value={stats.overdueTasks} />
        </div>

        {/* SECOND ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <AdminStatsCard title="Active Users" value={stats.activeUsers} />

          {/* COMPLETION CARD */}
          <div className="bg-gray-950 border border-gray-800 rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Goal Overview 🎯</h2>

              <p className="text-gray-400">
                Overall task completion performance
              </p>
            </div>

            {/* CIRCLE PROGRESS */}
            <div className="flex items-center justify-center my-10">
              <div className="relative w-60 h-60">
                <svg
                  className="w-full h-full rotate-[-90deg]"
                  viewBox="0 0 200 200"
                >
                  {/* BACKGROUND */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    stroke="#1f2937"
                    strokeWidth="16"
                    fill="none"
                  />

                  {/* PROGRESS */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    stroke="#22c55e"
                    strokeWidth="16"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={502}
                    strokeDashoffset={502 - (502 * stats.completionRate) / 100}
                  />
                </svg>

                {/* TEXT */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <h1 className="text-5xl font-bold">
                    {stats.completionRate}%
                  </h1>

                  <p className="text-gray-400 mt-2">Completion</p>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="grid grid-cols-2 border-t border-gray-800 pt-6">
              <div className="text-center">
                <p className="text-gray-400">Completed</p>

                <h3 className="text-4xl font-bold mt-2 text-green-400">
                  {stats.completedTasks}
                </h3>
              </div>

              <div className="text-center border-l border-gray-800">
                <p className="text-gray-400">Overdue</p>

                <h3 className="text-4xl font-bold mt-2 text-red-400">
                  {stats.overdueTasks}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* CHART + ACTIVITY */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <AdminCharts data={chartData} />

          <RecentActivity activities={recentActivities} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
