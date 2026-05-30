import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#22C55E", "#EAB308", "#EF4444"];

const TaskPieChart = ({ stats }) => {
  const data = [
    {
      name: "Completed",
      value: stats.completed,
    },
    {
      name: "Pending",
      value: stats.pending,
    },
    {
      name: "Overdue",
      value: stats.overdue,
    },
  ];

  return (
    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
      <h2 className="text-2xl font-bold mb-6">Task Distribution 🥧</h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" outerRadius={100} label>
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TaskPieChart;
