const StatsCard = ({ title, value }) => {
  return (
    <div className="bg-gray-900 text-white p-6 rounded-2xl border border-gray-800 hover:border-blue-500 transition">
      <h3 className="text-gray-400 text-lg">{title}</h3>

      <p className="text-4xl font-bold mt-4">{value}</p>
    </div>
  );
};

export default StatsCard;
