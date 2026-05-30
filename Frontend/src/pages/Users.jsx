import { useEffect, useState } from "react";

import AdminLayout from "../layouts/AdminLayout";

import UsersTable from "../components/dashboard/UsersTable";
import toast from "react-hot-toast";
import api from "../services/api";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/task/get-users");

      setUsers(response.data.users);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-4xl font-bold mb-8">Users 👥</h1>

      <UsersTable users={users} />
    </AdminLayout>
  );
};

export default Users;
