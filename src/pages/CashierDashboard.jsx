import Billing from "./Billing";
import TodayBills from "../components/TodayBills";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const CashierDashboard = () => {
  const { logout, user } = useAuth();

  return (
    <div style={styles.page}>
      {/* Top Bar */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Cashier Dashboard</h1>
          <p style={styles.subtitle}>
            Logged in as: <b>{user?.name || "Cashier"}</b>
          </p>
        </div>

        <button style={styles.logoutBtn} onClick={logout}>
          Logout
        </button>
      </div>

      {/* Billing Section */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          {/* <h2 style={styles.cardTitle}>Billing</h2> */}
        </div>
        <Billing />
      </div>

      {/* Today Bills */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          {/* <h2 style={styles.cardTitle}>Today’s Bills</h2> */}
        </div>
        <TodayBills />
      </div>

      {/* Footer Navigation */}
      <div style={styles.footer}>
        <Link to="/bills" style={styles.link}>
          View Full Bill History →
        </Link>
      </div>
    </div>
  );
};

export default CashierDashboard;


const styles = {
  page: {
    minHeight: "100vh",
    padding: "20px",
    background: "#f1f5f9",
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
    fontSize: "26px",
    fontWeight: "700",
    color: "#0f172a",
  },

  subtitle: {
    fontSize: "13px",
    color: "#64748b",
    marginTop: "4px",
  },

  logoutBtn: {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    background: "#dc2626",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },

  card: {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "18px",
    marginBottom: "20px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  },

  cardHeader: {
    borderBottom: "1px solid #e5e7eb",
    marginBottom: "14px",
    paddingBottom: "8px",
  },

  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
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
