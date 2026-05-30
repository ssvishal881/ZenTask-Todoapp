import { useEffect, useState } from "react";

import AdminLayout from "../layouts/AdminLayout";

import AllTasksTable from "../components/dashboard/AllTasksTable";

import api from "../services/api";
import toast from "react-hot-toast";

const AllTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

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
      <h1 className="text-4xl font-bold mb-8">All Tasks 📋</h1>

      <AllTasksTable tasks={tasks} deleteTask={deleteTask} />
    </AdminLayout>
  );
};

export default AllTasks;
