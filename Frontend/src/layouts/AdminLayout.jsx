import AdminSidebar from "../components/dashboard/AdminSidebar";
import Topbar from "../components/dashboard/Topbar";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <AdminSidebar />

      <div className="flex-1">
        <Topbar />

        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
