import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#22c55e", "#eab308", "#ef4444"];

const AdminCharts = ({ data }) => {
  return (
    <div className="bg-gray-950 border border-gray-800 p-6 rounded-3xl h-[400px]">
      <h2 className="text-2xl font-bold mb-8 text-white">Task Analytics 📊</h2>

      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie data={data} dataKey="value" outerRadius={130} label>
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdminCharts;
