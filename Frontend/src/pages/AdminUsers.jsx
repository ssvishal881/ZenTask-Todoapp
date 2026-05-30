import { useEffect, useState } from "react";

import AdminLayout from "../layouts/AdminLayout";

import UsersTable from "../components/dashboard/UsersTable";

import api from "../services/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      const response = await api.get(`/task/get-users?page=${page}&limit=5`);

      setUsers(response.data.users);

      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8 min-h-screen bg-black text-white">
        {/* HERO */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-3xl p-8 mb-10">
          <h1 className="text-5xl font-bold">Users Management 👥</h1>

          <p className="mt-4 text-blue-100 text-lg">
            Manage all registered users.
          </p>
        </div>

        {/* TABLE */}
        <div className="bg-gray-950 border border-gray-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">All Users</h2>

            <span className="bg-gray-900 px-5 py-2 rounded-xl border border-gray-800 text-gray-300">
              {users.length} Users
            </span>
          </div>

          <UsersTable users={users} />

          {/* PAGINATION */}
          <div className="flex justify-center items-center gap-4 mt-8 border border-red-500 p-4">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="bg-gray-800 px-4 py-2 rounded-xl disabled:opacity-50"
            >
              Previous
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="bg-gray-800 px-4 py-2 rounded-xl disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
