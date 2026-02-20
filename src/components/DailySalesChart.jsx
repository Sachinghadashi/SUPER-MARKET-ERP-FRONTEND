import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const DailySalesChart = ({ data }) => {
  // Format date nicely
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={styles.tooltip}>
          <p style={{ margin: 0 }}>
            📅 {formatDate(label)}
          </p>
          <p style={{ margin: 0, fontWeight: 600 }}>
            💰 ₹{payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>
        📈 Daily Sales Overview
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient
              id="colorRevenue"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="#2563eb"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="#2563eb"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="_id"
            tickFormatter={formatDate}
            tick={{ fontSize: 12 }}
          />

          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) =>
              `₹${value}`
            }
          />

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="totalRevenue"
            stroke="#2563eb"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailySalesChart;

/* ================= STYLES ================= */

const styles = {
  card: {
    background: "#ffffff",
    padding: 20,
    borderRadius: 14,
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    marginBottom: 20,
  },

  title: {
    marginBottom: 15,
    fontWeight: 600,
    fontSize: 18,
    color: "#0f172a",
  },

  tooltip: {
    background: "#ffffff",
    padding: 10,
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    fontSize: 13,
  },
};