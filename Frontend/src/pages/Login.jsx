import React, { useState } from "react";

import api from "../services/api";

import { useNavigate, Link } from "react-router-dom";

import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

import { Eye, EyeOff } from "lucide-react";
const Login = () => {
  const { login } = useAuth();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",

    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  // HANDLE INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  // HANDLE LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", formData);

      toast.success(response.data.message);

      login(response.data.user);

      const role = response.data.user.role;

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Wrong email or password");
      } else {
        toast.error("Login failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900 px-4 overflow-hidden relative">
      {/* BACKGROUND BLUR */}
      <div className="absolute w-96 h-96 bg-blue-500/20 blur-3xl rounded-full top-10 left-10"></div>

      <div className="absolute w-96 h-96 bg-purple-500/20 blur-3xl rounded-full bottom-10 right-10"></div>

      {/* CARD */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl"
      >
        {/* TITLE */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-white">ZenTask</h1>

          <p className="text-gray-300 mt-4">Welcome back 👋</p>
        </div>

        {/* EMAIL */}
        <div className="mb-5">
          <label className="text-gray-300 text-sm">Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mt-2 p-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder-gray-400 outline-none focus:border-blue-500 transition"
            required
          />
        </div>

        {/* PASSWORD */}
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-800 text-white outline-none border border-gray-700 focus:border-blue-500"
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-2xl font-semibold transition shadow-lg"
        >
          Login
        </button>

        {/* REGISTER */}
        <p className="text-center text-gray-400 mt-8">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-400 hover:text-blue-300 transition"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
