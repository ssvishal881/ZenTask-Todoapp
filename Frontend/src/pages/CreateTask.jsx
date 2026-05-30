import { useState } from "react";

import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

import api from "../services/api";
import UserLayout from "../layouts/UserLayout";
import toast from "react-hot-toast";

const CreateTask = () => {
  const [formData, setFormData] = useState({
    title: "",
    priority: "low",
    dueDate: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/task/create", formData);

      toast.success(response.data.message);

      setFormData({
        title: "",
        priority: "low",
        dueDate: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating task");
    }
  };

  return (
    <UserLayout>
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-8">Create Task ✨</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 p-8 rounded-2xl max-w-xl"
        >
          <input
            type="text"
            name="title"
            placeholder="Task Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full mb-5 p-3 rounded-lg bg-gray-800 text-white outline-none"
          />

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full mb-5 p-3 rounded-lg bg-gray-800 text-white outline-none"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full mb-5 p-3 rounded-lg bg-gray-800 text-white outline-none"
          />

          <button className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg">
            Create Task
          </button>
        </form>
      </div>
    </UserLayout>
  );
};

export default CreateTask;
