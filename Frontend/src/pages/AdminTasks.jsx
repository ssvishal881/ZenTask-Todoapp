import { useEffect, useState } from "react";

import AdminLayout from "../layouts/AdminLayout";

import AllTasksTable from "../components/dashboard/AllTasksTable";

import api from "../services/api";

import toast from "react-hot-toast";

const AdminTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  // FETCH TASKS
  const fetchTasks = async () => {
    try {
      const response = await api.get("/task");

      setTasks(response.data.task);
    } catch (err) {
      console.log(err);
    }
  };

  // DELETE TASK
  const deleteTask = async (taskId) => {
    try {
      const response = await api.delete(`/task/deletebyAdmin/${taskId}`);

      toast.success(response.data.message);

      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8 min-h-screen bg-black text-white">
        {/* HERO */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-3xl p-8 mb-10">
          <h1 className="text-5xl font-bold">Tasks Management 📋</h1>

          <p className="mt-4 text-purple-100 text-lg">
            View and manage all platform tasks.
          </p>
        </div>

        {/* TABLE */}
        <div className="bg-gray-950 border border-gray-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">All Tasks</h2>

            <span className="bg-gray-900 px-5 py-2 rounded-xl border border-gray-800 text-gray-300">
              {tasks.length} Tasks
            </span>
          </div>

          <AllTasksTable tasks={tasks} deleteTask={deleteTask} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTasks;
