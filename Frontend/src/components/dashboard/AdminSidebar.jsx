import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Shield,
  LogOut,
  User,
  BarChart3,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import toast from "react-hot-toast";

import api from "../../services/api";

const AdminSidebar = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const { logout } = useAuth();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard size={20} />,
    },

    {
      name: "Users",
      path: "/admin/users",
      icon: <Users size={20} />,
    },

    {
      name: "All Tasks",
      path: "/admin/tasks",
      icon: <ClipboardList size={20} />,
    },

    {
      name: "Reports",
      path: "/admin/reports",
      icon: <BarChart3 size={20} />,
    },

    {
      name: "User Dashboard",
      path: "/dashboard",
      icon: <User size={20} />,
    },
  ];

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");

      logout();

      toast.success("Logout successful");

      navigate("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="w-72 min-h-screen bg-black border-r border-gray-800 p-6 flex flex-col justify-between text-white">
      {/* TOP */}
      <div>
        {/* LOGO */}
        <div className="mb-14">
          <div className="flex items-center gap-3">
            <div className="bg-red-500 p-3 rounded-2xl">
              <Shield size={28} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">ZenTask</h1>

              <p className="text-red-400 text-sm">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* MENU */}
        <div className="flex flex-col gap-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 ${
                location.pathname === item.path
                  ? "bg-red-500 text-white shadow-lg"
                  : "hover:bg-gray-900 text-gray-300"
              }`}
            >
              {item.icon}

              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* BOTTOM */}
      <div>
        <div className="mb-4 p-4 bg-gray-900 rounded-2xl border border-gray-800">
          <p className="text-sm text-gray-400">System Status</p>

          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>

            <span className="text-sm">Online</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 transition px-5 py-4 rounded-2xl"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
