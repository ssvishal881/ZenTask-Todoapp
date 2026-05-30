import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-10 py-5 border-b border-gray-800 bg-gray-950 text-white sticky top-0 z-50">
      {/* Logo */}
      <h1 className="text-3xl font-bold text-blue-500">ZenTask</h1>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-8">
        <a href="#home" className="hover:text-blue-400 transition">
          Home
        </a>

        <a href="#about" className="hover:text-blue-400 transition">
          About
        </a>

        <a href="#services" className="hover:text-blue-400 transition">
          Services
        </a>

        {/* Buttons */}
        <Link
          to="/login"
          className="px-5 py-2 rounded-lg border border-blue-500 hover:bg-blue-500 transition"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition"
        >
          Register
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
