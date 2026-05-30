import React, { useState } from "react";

import api from "../services/api";

import { useNavigate, Link } from "react-router-dom";

import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",

    email: "",

    password: "",
  });

  // HANDLE INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  // HANDLE REGISTER
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/register", formData);

      toast.success(response.data.message);

      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Register failed");
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

          <p className="text-gray-300 mt-4">Create your account 🚀</p>
        </div>

        {/* USERNAME */}
        <div className="mb-5">
          <label className="text-gray-300 text-sm">Username</label>

          <input
            type="text"
            name="username"
            placeholder="Enter username"
            value={formData.username}
            onChange={handleChange}
            className="w-full mt-2 p-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder-gray-400 outline-none focus:border-blue-500 transition"
            required
          />
        </div>

        {/* EMAIL */}
        <div className="mb-5">
          <label className="text-gray-300 text-sm">Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mt-2 p-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder-gray-400 outline-none focus:border-blue-500 transition"
            required
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-7">
          <label className="text-gray-300 text-sm">Password</label>

          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            className="w-full mt-2 p-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder-gray-400 outline-none focus:border-blue-500 transition"
            required
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-2xl font-semibold transition shadow-lg"
        >
          Register
        </button>

        {/* LOGIN */}
        <p className="text-center text-gray-400 mt-8">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-400 hover:text-blue-300 transition"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
