const AllTasksTable = ({ tasks, deleteTask }) => {
  return (
    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-6">All Tasks 📋</h2>

      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-gray-700">
            <th className="pb-3">Title</th>

            <th className="pb-3">Priority</th>

            <th className="pb-3">Status</th>

            <th className="pb-3">User</th>

            <th className="pb-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((task) => (
            <tr key={task._id} className="border-b border-gray-800">
              <td className="py-4">{task.title}</td>

              <td className="capitalize">{task.priority}</td>

              <td className="capitalize">{task.status}</td>

              <td>{task.user?.username}</td>

              <td>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllTasksTable;
