import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

const UserLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};

export default UserLayout;
