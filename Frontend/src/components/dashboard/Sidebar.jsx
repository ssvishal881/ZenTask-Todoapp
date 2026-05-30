import {
  LayoutDashboard,
  ClipboardList,
  PlusSquare,
  AlertTriangle,
  User,
  LogOut,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

import api from "../../services/api";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import toast from "react-hot-toast";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      const response = await api.post("/auth/logout");

      toast.success(response.data.message);

      logout();

      navigate("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },

    {
      name: "My Tasks",
      path: "/my-tasks",
      icon: <ClipboardList size={20} />,
    },

    {
      name: "Create Task",
      path: "/create-task",
      icon: <PlusSquare size={20} />,
    },

    {
      name: "Overdue",
      path: "/overdue",
      icon: <AlertTriangle size={20} />,
    },

    {
      name: "Profile",
      path: "/profile",
      icon: <User size={20} />,
    },
  ];

  return (
    <div className="w-64 min-h-screen flex-shrink-0 bg-gray-900 text-white border-r border-gray-800 p-6 flex flex-col justify-between">
      {/* TOP */}
      <div>
        {/* LOGO */}
        <h1 className="text-3xl font-bold text-blue-500 mb-12">ZenTask</h1>

        {/* MENU */}
        <div className="flex flex-col gap-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                location.pathname === item.path
                  ? "bg-blue-500"
                  : "hover:bg-gray-800"
              }`}
            >
              {item.icon}

              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* BOTTOM */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 transition"
      >
        <LogOut size={20} />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
