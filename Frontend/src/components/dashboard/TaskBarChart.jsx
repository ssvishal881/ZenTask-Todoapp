import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TaskBarChart = ({ stats }) => {
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
      <h2 className="text-2xl font-bold mb-6">Task Analytics 📊</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Bar dataKey="value" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TaskBarChart;
