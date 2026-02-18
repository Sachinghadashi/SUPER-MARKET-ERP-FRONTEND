import Billing from "./Billing";
import TodayBills from "../components/TodayBills";
import MyBillsHistory from "../components/MyBillsHistory";

import { useAuth } from "../context/AuthContext";

const CashierDashboard = () => {
  const { logout, user } = useAuth();

  return (
    <div style={styles.page}>
      {/* ================= HEADER ================= */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>💳 Cashier Dashboard</h1>

          <p style={styles.subtitle}>
            Welcome, <b>{user?.name}</b>
          </p>
        </div>

        {/* <button
          style={styles.logoutBtn}
          onClick={logout}
        >
          ⏻ Logout
        </button> */}
      </div>

      {/* ================= BILLING ================= */}
      <div style={styles.card}>
        <Billing />
      </div>

      {/* ================= TODAY BILLS ================= */}
      <div style={styles.card}>
        <TodayBills />
      </div>

      {/* ================= HISTORY ================= */}
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
    padding: 16,
    background: "#f1f5f9",
  },

  /* HEADER */

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
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
    fontSize: 13,
    fontWeight: "600",
    cursor: "pointer",
  },

  /* CARDS */

  card: {
    background: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 18,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#1e293b",
  },
};
