import { useState } from "react";

import UserLayout from "../layouts/UserLayout";

import { useAuth } from "../context/AuthContext";

import api from "../services/api";

import toast from "react-hot-toast";

const Profile = () => {
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });

  // IMAGE UPLOAD
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("profileImage", file);

    try {
      const response = await api.put("/auth/upload-profile", formData);

      toast.success("Profile image updated");

      setUser(response.data.user);
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  const updateProfile = async () => {
    try {
      const response = await api.put("/auth/update-profile", formData);

      toast.success(response.data.message);

      setUser(response.data.user);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <UserLayout>
      <div className="p-8">
        {/* TITLE */}
        <h1 className="text-5xl font-bold text-white mb-10">My Profile 👤</h1>

        {/* PROFILE CARD */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-10 max-w-4xl">
          {/* TOP */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
            {/* AVATAR */}
            <div className="relative">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="profile"
                  className="w-36 h-36 rounded-full object-cover border-4 border-blue-500"
                />
              ) : (
                <div className="w-36 h-36 rounded-full bg-blue-500 flex items-center justify-center text-5xl font-bold uppercase">
                  {user?.username?.charAt(0)}
                </div>
              )}

              {/* UPLOAD */}
              <label className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded-full cursor-pointer text-sm">
                +
                <input type="file" hidden onChange={handleImageUpload} />
              </label>
            </div>

            {/* USER INFO */}
            <div>
              <h2 className="text-4xl font-bold text-white">
                {user?.username}
              </h2>

              <p className="text-gray-400 mt-2 text-lg">{user?.email}</p>

              <span className="inline-block mt-4 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-xl capitalize">
                {user?.role === "admin" ? "Admin" : "User"}
              </span>
            </div>
          </div>

          {/* DETAILS */}
          {/* EDIT PROFILE */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* USERNAME */}
            <div>
              <label className="block mb-2 text-gray-400">Username</label>

              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    username: e.target.value,
                  })
                }
                className="w-full bg-gray-800 border border-gray-700 rounded-2xl p-4 text-white outline-none focus:border-blue-500"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block mb-2 text-gray-400">Email</label>

              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                className="w-full bg-gray-800 border border-gray-700 rounded-2xl p-4 text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* SAVE BUTTON */}
          <div className="mt-8">
            <button
              onClick={updateProfile}
              className="bg-blue-500 hover:bg-blue-600 px-8 py-4 rounded-2xl font-semibold transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default Profile;
