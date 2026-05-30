import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Herosection = () => {
  const { user } = useAuth();
  return (
    <section
      id="home"
      className="flex flex-col items-center justify-center text-center px-6 py-28"
    >
      <h1 className="text-5xl md:text-6xl font-bold leading-tight max-w-4xl">
        Manage Your Tasks <br />
        Efficiently 🚀
      </h1>

      <p className="mt-6 text-gray-400 text-lg max-w-2xl">
        Organize your work, track progress, manage deadlines, and boost
        productivity with our powerful Todo Management App.
      </p>

      <div className="mt-10 flex gap-5">
        <Link
          to={
            user
              ? user.role === "admin"
                ? "/admin/dashboard"
                : "/dashboard"
              : "/register"
          }
          className="px-7 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition font-semibold"
        >
          Get Started
        </Link>

        <a
          href="#about"
          className="px-7 py-3 rounded-xl border border-gray-600 hover:border-white transition"
        >
          Learn More
        </a>
      </div>
    </section>
  );
};

export default Herosection;
