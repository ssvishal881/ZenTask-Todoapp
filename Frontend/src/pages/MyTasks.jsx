import { useEffect, useState } from "react";

import api from "../services/api";
import toast from "react-hot-toast";

import UserLayout from "../layouts/UserLayout";

const MyTasks = () => {
  // SEARCH + FILTER STATES
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("");

  const [priorityFilter, setPriorityFilter] = useState("");

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);

  const tasksPerPage = 5;

  // TASK STATES
  const [tasks, setTasks] = useState([]);

  // EDIT STATES
  const [editingTask, setEditingTask] = useState(null);

  const [editForm, setEditForm] = useState({
    title: "",
    priority: "low",
    dueDate: "",
    status: "pending",
  });

  useEffect(() => {
    fetchTasks();
  }, [search, statusFilter, priorityFilter]);

  // FETCH TASKS
  const fetchTasks = async () => {
    try {
      const response = await api.get(
        `/task/my-task?search=${search}&status=${statusFilter}&priority=${priorityFilter}`,
      );

      setTasks(response.data.tasks);
    } catch (err) {
      console.log(err);

      toast.error("Error fetching tasks");
    }
  };

  // DELETE TASK
  const deleteTask = async (taskId) => {
    try {
      const response = await api.delete(`/task/delete/${taskId}`);

      toast.success(response.data.message);

      fetchTasks();
    } catch (err) {
      console.log(err);

      toast.error("Error deleting task");
    }
  };

  // FILTER TASKS

  // PAGINATION LOGIC
  const indexOfLastTask = currentPage * tasksPerPage;

  const indexOfFirstTask = indexOfLastTask - tasksPerPage;

  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  // MARK COMPLETED
  const markCompleted = async (taskId) => {
    try {
      const task = tasks.find((t) => t._id === taskId);

      await api.put(`/task/update/${taskId}`, {
        title: task.title,
        priority: task.priority,
        dueDate: task.dueDate,
        status: "completed",
      });

      toast.success("Task completed");

      fetchTasks();
    } catch (err) {
      console.log(err);

      toast.error("Error updating task");
    }
  };

  // OPEN EDIT MODAL
  const openEdit = (task) => {
    setEditingTask(task._id);

    setEditForm({
      title: task.title,
      priority: task.priority,
      dueDate: task.dueDate?.slice(0, 10),
      status: task.status,
    });
  };

  // HANDLE INPUT
  const handleChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  // UPDATE TASK
  const updateTask = async () => {
    try {
      const response = await api.put(`/task/update/${editingTask}`, editForm);

      toast.success(response.data.message);

      setEditingTask(null);

      fetchTasks();
    } catch (err) {
      console.log(err);

      toast.error("Error updating task");
    }
  };

  return (
    <UserLayout>
      <div className="p-8 min-h-screen">
        {/* PAGE TITLE */}
        <h1 className="text-4xl font-bold mb-8 text-white">My Tasks 📋</h1>

        {/* SEARCH + FILTER */}
        <div className="flex flex-col xl:flex-row gap-4 mb-10">
          {/* SEARCH */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 focus:border-blue-500 text-white p-4 pl-12 rounded-2xl outline-none transition"
            />

            {/* SEARCH ICON */}
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>

          {/* STATUS FILTER */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-900 border border-gray-800 focus:border-blue-500 text-white p-4 rounded-2xl outline-none transition min-w-[180px]"
          >
            <option value="">All Status</option>

            <option value="pending">Pending</option>

            <option value="in-progress">In Progress</option>

            <option value="completed">Completed</option>
          </select>

          {/* PRIORITY FILTER */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-gray-900 border border-gray-800 focus:border-blue-500 text-white p-4 rounded-2xl outline-none transition min-w-[180px]"
          >
            <option value="">All Priority</option>

            <option value="low">Low</option>

            <option value="medium">Medium</option>

            <option value="high">High</option>
          </select>
        </div>

        {/* TASKS */}
        <div className="space-y-6">
          {currentTasks.map((task) => (
            <div
              key={task._id}
              className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-blue-500 transition"
            >
              <h2 className="text-2xl font-bold">{task.title}</h2>

              <p className="mt-3 text-gray-400">Priority: {task.priority}</p>

              <p className="text-gray-400">Status: {task.status}</p>

              <p className="text-gray-400">
                Due Date: {task.dueDate?.slice(0, 10)}
              </p>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap gap-4 mt-5 flex-wrap">
                <button
                  onClick={() => markCompleted(task._id)}
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-white"
                >
                  Complete
                </button>

                <button
                  onClick={() => openEdit(task)}
                  className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg text-white"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteTask(task._id)}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="flex gap-3 mt-10 flex-wrap">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 rounded-lg text-white ${
                currentPage === index + 1
                  ? "bg-blue-500"
                  : "bg-gray-500 dark:bg-gray-800"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-gray-900 text-white p-8 rounded-2xl w-full max-w-lg">
            <h2 className="text-3xl font-bold mb-6">Edit Task</h2>

            {/* TITLE */}
            <input
              type="text"
              name="title"
              value={editForm.title}
              onChange={handleChange}
              className="w-full mb-5 p-3 rounded-lg bg-gray-800 text-white outline-none"
            />

            {/* PRIORITY */}
            <select
              name="priority"
              value={editForm.priority}
              onChange={handleChange}
              className="w-full mb-5 p-3 rounded-lg bg-gray-800 text-white outline-none"
            >
              <option value="low">Low</option>

              <option value="medium">Medium</option>

              <option value="high">High</option>
            </select>

            {/* STATUS */}
            <select
              name="status"
              value={editForm.status}
              onChange={handleChange}
              className="w-full mb-5 p-3 rounded-lg bg-gray-800 text-white outline-none"
            >
              <option value="pending">Pending</option>

              <option value="in-progress">In Progress</option>

              <option value="completed">Completed</option>
            </select>

            {/* DUE DATE */}
            <input
              type="date"
              name="dueDate"
              value={editForm.dueDate}
              onChange={handleChange}
              className="w-full mb-5 p-3 rounded-lg bg-gray-800 text-white outline-none"
            />

            {/* BUTTONS */}
            <div className="flex flex-wrap gap-4 flex-wrap">
              <button
                onClick={updateTask}
                className="bg-blue-500 hover:bg-blue-600 px-5 py-3 rounded-lg text-white"
              >
                Save
              </button>

              <button
                onClick={() => setEditingTask(null)}
                className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-lg text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
};

export default MyTasks;
