import Billing from "./Billing";
import TodayBills from "../components/TodayBills";
import MyBillsHistory from "../components/MyBillsHistory";

import { useAuth } from "../context/AuthContext";

const CashierDashboard = () => {
  const { logout, user } = useAuth();

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Cashier Dashboard</h1>

          <p style={styles.subtitle}>
            Logged in as <b>{user?.name}</b>
          </p>
        </div>

        <button
          style={styles.logoutBtn}
          onClick={logout}
        >
          Logout
        </button>
      </div>

      {/* Billing */}
      <div style={styles.card}>
        <Billing />
      </div>

      {/* Today Bills */}
      <div style={styles.card}>
        <h3>📅 Today’s Bills</h3>
        <TodayBills />
      </div>

      {/* My Bills History */}
      <div style={styles.card}>
        <MyBillsHistory />
      </div>
    </div>
  );
};

export default CashierDashboard;

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    padding: 20,
    background: "#f1f5f9",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 13,
    color: "#64748b",
  },

  logoutBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: 6,
    cursor: "pointer",
  },

  card: {
    background: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  },
};
