import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";

import api from "../services/api";

const AdminUserProfile = () => {
  const { userId } = useParams();

  const [user, setUser] = useState(null);

  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get(`/task/admin/user/${userId}`);

      setUser(response.data.user);

      setStats(response.data.stats);
    } catch (err) {
      console.log(err);
    }
  };

  if (!user) {
    return (
      <AdminLayout>
        <div className="p-8 text-white">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8 text-white">
        {/* PROFILE CARD */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 mb-10">
          <div className="flex items-center gap-6">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt=""
                className="w-28 h-28 rounded-full object-cover border-4 border-blue-500"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-blue-500 flex items-center justify-center text-4xl font-bold">
                {user.username?.charAt(0)}
              </div>
            )}

            <div>
              <h1 className="text-4xl font-bold">{user.username}</h1>

              <p className="text-gray-400 mt-2">{user.email}</p>

              <span className="inline-block mt-4 bg-blue-500 px-4 py-2 rounded-full">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800">
            <p className="text-gray-400">Total Tasks</p>

            <h2 className="text-5xl font-bold mt-4">{stats.totalTasks}</h2>
          </div>

          <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800">
            <p className="text-gray-400">Completed Tasks</p>

            <h2 className="text-5xl font-bold mt-4 text-green-400">
              {stats.completedTasks}
            </h2>
          </div>

          <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800">
            <p className="text-gray-400">Overdue Tasks</p>

            <h2 className="text-5xl font-bold mt-4 text-red-400">
              {stats.overdueTasks}
            </h2>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUserProfile;
