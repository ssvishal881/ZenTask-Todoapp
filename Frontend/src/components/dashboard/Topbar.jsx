import { Bell } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import socket from "../../socket";

const Topbar = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);

  const [showNotifications, setShowNotifications] = useState(false);

  const [showProfile, setShowProfile] = useState(false);

  const notificationRef = useRef(null);

  const profileRef = useRef(null);

  // LOGOUT
  const handleLogout = () => {
    logout();

    localStorage.removeItem("token");

    navigate("/login");
  };

  // FETCH NOTIFICATIONS
  useEffect(() => {
    socket.on("notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      let response;

      if (user?.role === "admin") {
        response = await api.get("/task/admin-notifications");
      } else {
        response = await api.get("/task/notifications");
      }

      setNotifications(response.data.notifications);
    } catch (err) {
      console.log(err);
    }
  };

  // CLOSE DROPDOWNS ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }

      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // GREETING
  const hour = new Date().getHours();

  let greeting = "Welcome";

  if (hour < 12) {
    greeting = "Good Morning ☀️";
  } else if (hour < 18) {
    greeting = "Good Afternoon 🌤️";
  } else {
    greeting = "Good Evening 🌙";
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-6 px-8 py-5 border-b border-gray-800 bg-gray-900 text-white">
      {/* LEFT */}
      <div>
        <h2 className="text-3xl font-bold">
          {greeting} {user?.username} 👋
        </h2>

        <p className="text-gray-400 mt-1">Stay productive today 🚀</p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-5">
        {/* QUICK INFO */}
        <div className="hidden md:flex items-center gap-3 bg-gray-800 px-5 py-3 rounded-xl">
          <span className="text-green-400">●</span>

          <p className="text-sm text-gray-300">Productivity Mode Active</p>
        </div>

        {/* NOTIFICATIONS */}
        <div ref={notificationRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative bg-gray-800 p-3 rounded-xl hover:bg-gray-700 transition"
          >
            <Bell size={20} />

            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-4 w-80 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-5 z-50">
              <h3 className="text-xl font-semibold mb-4">Notifications 🔔</h3>

              {notifications.length === 0 ? (
                <div className="bg-gray-800 p-4 rounded-xl text-gray-400">
                  No notifications
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-blue-500 transition"
                    >
                      {notification.message}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* PROFILE */}
        <div ref={profileRef} className="relative">
          <div
            onClick={() => setShowProfile(!showProfile)}
            className="cursor-pointer"
          >
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt="profile"
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center font-bold text-lg uppercase">
                {user?.username?.charAt(0)}
              </div>
            )}
          </div>

          {showProfile && (
            <div className="absolute right-0 mt-4 w-80 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-5 z-50">
              <div className="flex items-center gap-4">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="profile"
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-xl font-bold uppercase">
                    {user?.username?.charAt(0)}
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold">{user?.username}</h3>

                  <p className="text-gray-400 text-sm">{user?.email}</p>

                  <span className="inline-block mt-2 bg-blue-500 px-3 py-1 rounded-full text-xs">
                    {user?.role}
                  </span>
                </div>
              </div>

              <div className="mt-5 border-t border-gray-800 pt-4">
                <p className="text-gray-400 text-sm">Account Status</p>

                <p className="text-green-400 font-medium">Active ●</p>
              </div>

              <div className="mt-5 flex flex-col gap-3">
                <Link
                  to="/profile"
                  className="bg-blue-500 hover:bg-blue-600 text-center py-3 rounded-xl transition"
                >
                  View Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 py-3 rounded-xl transition"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
