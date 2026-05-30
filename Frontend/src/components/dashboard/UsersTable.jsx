import { useNavigate } from "react-router-dom";

const UsersTable = ({ users }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-6">Users 👥</h2>

      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-gray-700">
            <th className="pb-3">Username</th>

            <th className="pb-3">Email</th>

            <th className="pb-3">Role</th>

            <th className="pb-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user._id}
              className="border-b border-gray-800 hover:bg-gray-800 transition"
            >
              <td className="py-4">{user.username}</td>

              <td>{user.email}</td>

              <td>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    user.role === "admin"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {user.role}
                </span>
              </td>

              <td>
                <button
                  onClick={() => navigate(`/admin/user/${user._id}`)}
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition"
                >
                  View Profile
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <div className="text-center py-10 text-gray-400">No users found</div>
      )}
    </div>
  );
};

export default UsersTable;
