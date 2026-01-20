import Billing from "./Billing";
import TodayBills from "../components/TodayBills";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const CashierDashboard = () => {
  const { logout } = useAuth();

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>👨‍💼 Cashier Dashboard</h1>
        <button style={styles.logoutBtn} onClick={logout}>
          🚪 Logout
        </button>
      </div>

      {/* Billing Section */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>🧾 Billing</h2>
        <Billing />
      </div>

      {/* Today Bills */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>📅 Today’s Bills</h2>
        <TodayBills />
      </div>

      {/* View All Bills */}
      <div style={styles.footer}>
        <Link to="/bills" style={styles.link}>
          📜 View All Bill History
        </Link>
      </div>
    </div>
  );
};

export default CashierDashboard;

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    padding: "20px",
    background: "#f8fafc",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: "20px",
    gap: "10px",
  },

  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827",
  },

  logoutBtn: {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "none",
    background: "#ef4444",
    color: "#ffffff",
    fontSize: "14px",
    cursor: "pointer",
  },

  card: {
    background: "#ffffff",
    borderRadius: "14px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },

  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "15px",
    color: "#1f2937",
  },

  footer: {
    textAlign: "center",
    marginTop: "10px",
  },

  link: {
    fontSize: "15px",
    color: "#2563eb",
    fontWeight: "600",
    textDecoration: "none",
  },
};
