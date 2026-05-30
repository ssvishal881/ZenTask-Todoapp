import { useEffect, useState } from "react";

import api from "../services/api";

import UserLayout from "../layouts/UserLayout";

const OverdueTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchOverdueTasks();
  }, []);

  // FETCH OVERDUE TASKS
  const fetchOverdueTasks = async () => {
    try {
      const response = await api.get("/task/overdue");

      setTasks(response.data.overdueTask);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <UserLayout>
      <div className="p-8">
        {/* TITLE */}
        <h1 className="text-4xl font-bold mb-8 text-white">Overdue Tasks ⏰</h1>

        {/* NO TASKS */}
        {tasks.length === 0 ? (
          <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 text-center">
            <h2 className="text-2xl font-semibold text-gray-300">
              No Overdue Tasks 🎉
            </h2>

            <p className="text-gray-500 mt-3">Great job! You're on track.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-red-900 p-6 rounded-2xl border border-red-700"
              >
                <h2 className="text-2xl font-semibold">{task.title}</h2>

                <p className="mt-3 text-red-200">
                  Due Date: {task.dueDate?.slice(0, 10)}
                </p>

                <p className="mt-2 capitalize">Priority: {task.priority}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default OverdueTasks;
