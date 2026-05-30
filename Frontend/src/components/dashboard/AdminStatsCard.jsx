const AdminStatsCard = ({ title, value }) => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-8 rounded-3xl shadow-xl hover:border-red-500 transition">
      <p className="text-gray-400 text-lg">{title}</p>

      <h2 className="text-5xl font-bold mt-5 text-white">{value}</h2>
    </div>
  );
};

export default AdminStatsCard;
