import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header style={styles.header}>
      {/* Logo */}
      <div
        style={styles.logo}
        onClick={() =>
          navigate(user?.role === "admin" ? "/admin" : "/cashier")
        }
      >
        🏪 Dilraj Kirana Store
      </div>

      {/* Right Section */}
      <div style={styles.rightSection}>
        <div style={styles.userInfo}>
          👤 {user?.name}
          <span style={styles.role}> ({user?.role})</span>
        </div>

        {/* Power Logout */}
        <span
          title="Logout"
          onClick={logout}
          style={styles.logoutIcon}
        >
          ⏻
        </span>
      </div>
    </header>
  );
};

export default Header;

/* ================= STYLES ================= */

const styles = {
  header: {
    width: "100%",
    background: "#0f172a",
    color: "#f8fafc",
    padding: "12px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
  },

  logo: {
    fontSize: "18px",
    fontWeight: "700",
    cursor: "pointer",
  },

  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  userInfo: {
    fontSize: "14px",
    fontWeight: "500",
  },

  role: {
    fontSize: "12px",
    color: "#93c5fd",
  },

  logoutIcon: {
    fontSize: "22px",
    cursor: "pointer",
    color: "#f87171",
    transition: "0.2s ease",
  },
};
