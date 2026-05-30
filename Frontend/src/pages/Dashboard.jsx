import { useEffect, useState } from "react";
import UserLayout from "../layouts/UserLayout";
import StatsCard from "../components/dashboard/StatsCard";

import TaskBarChart from "../components/dashboard/TaskBarChart";
import TaskPieChart from "../components/dashboard/TaskPieChart";
import TaskActivityChart from "../components/dashboard/TaskActivityChart";
import toast from "react-hot-toast";

import api from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
  });

  const [activityData, setActivityData] = useState([]);

  useEffect(() => {
    fetchStats();

    fetchTaskActivity();
  }, []);

  // FETCH STATS
  const fetchStats = async () => {
    try {
      const response = await api.get("/task/dashboard");

      setStats(response.data.stats);
    } catch (err) {
      console.log(err);
    }
  };

  // FETCH ACTIVITY GRAPH
  const fetchTaskActivity = async () => {
    try {
      const response = await api.get("/task/dashboard/taskPerDay");

      setActivityData(response.data.tasksPerDay);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <UserLayout>
      <h1 className="text-4xl font-bold mb-8">Dashboard 🚀</h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatsCard title="Total Tasks" value={stats.total} />

        <StatsCard title="Completed" value={stats.completed} />

        <StatsCard title="Pending" value={stats.pending} />

        <StatsCard title="Overdue" value={stats.overdue} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <TaskBarChart stats={stats} />

        <TaskPieChart stats={stats} />
      </div>

      <TaskActivityChart data={activityData} />
    </UserLayout>
  );
};

export default Dashboard;
