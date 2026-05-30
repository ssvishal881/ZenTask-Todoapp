import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TaskActivityChart = ({ data }) => {
  return (
    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
      <h2 className="text-2xl font-bold mb-6">Task Activity 📈</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="_id" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="count"
            stroke="#3B82F6"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TaskActivityChart;
