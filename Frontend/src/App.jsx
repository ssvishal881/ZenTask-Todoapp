import React from "react";
import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

import ProtectedRoutes from "./routes/ProtectedRoutes";
import AdminRoutes from "./routes/AdminRoutes";

// USER PAGES
import Dashboard from "./pages/Dashboard";
import MyTasks from "./pages/MyTasks";
import CreateTask from "./pages/CreateTask";
import OverdueTasks from "./pages/OverdueTasks";
import Profile from "./pages/Profile";

// ADMIN PAGES
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminTasks from "./pages/AdminTasks";
import AdminUserProfile from "./pages/AdminUserProfile";
import AdminReports from "./pages/AdminReports";

const App = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* USER ROUTES */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoutes>
            <Dashboard />
          </ProtectedRoutes>
        }
      />

      <Route
        path="/my-tasks"
        element={
          <ProtectedRoutes>
            <MyTasks />
          </ProtectedRoutes>
        }
      />

      <Route
        path="/create-task"
        element={
          <ProtectedRoutes>
            <CreateTask />
          </ProtectedRoutes>
        }
      />

      <Route
        path="/overdue"
        element={
          <ProtectedRoutes>
            <OverdueTasks />
          </ProtectedRoutes>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoutes>
            <Profile />
          </ProtectedRoutes>
        }
      />

      {/* ADMIN ROUTES */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoutes>
            <AdminDashboard />
          </AdminRoutes>
        }
      />

      <Route
        path="/admin/users"
        element={
          <AdminRoutes>
            <AdminUsers />
          </AdminRoutes>
        }
      />

      <Route
        path="/admin/tasks"
        element={
          <AdminRoutes>
            <AdminTasks />
          </AdminRoutes>
        }
      />

      <Route
        path="/admin/reports"
        element={
          <AdminRoutes>
            <AdminReports />
          </AdminRoutes>
        }
      />

      <Route
        path="/admin/user/:userId"
        element={
          <AdminRoutes>
            <AdminUserProfile />
          </AdminRoutes>
        }
      />
    </Routes>
  );
};

export default App;
