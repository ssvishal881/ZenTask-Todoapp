const RecentActivity = ({ activities }) => {
  return (
    <div className="bg-gray-950 border border-gray-800 p-6 rounded-3xl">
      <h2 className="text-2xl font-bold mb-8 text-white">Recent Activity ⚡</h2>

      <div className="space-y-5">
        {activities.map((activity) => (
          <div
            key={activity._id}
            className="bg-gray-900 border border-gray-800 p-5 rounded-2xl"
          >
            <p className="text-white font-medium">{activity.user?.username}</p>

            <p className="text-gray-400 mt-2">Created task: {activity.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
