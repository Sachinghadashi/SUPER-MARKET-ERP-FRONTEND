import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const DailySalesChart = ({ data }) => {
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>📈 Daily Sales</h3>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="_id" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="totalRevenue"
            stroke="#2563eb"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailySalesChart;

/* ================= STYLES ================= */

const styles = {
  card: {
    background: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },

  title: {
    marginBottom: 10,
  },
};
