import { useState } from "react";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/login", { email, password });
      login(res.data);

      if (res.data.role === "admin") navigate("/admin");
      else navigate("/cashier");
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div style={darkMode ? styles.pageDark : styles.page}>
      {/* ================= HEADER ================= */}
      <header style={styles.appHeader}>
        <h2 style={styles.appTitle}>🏪 Supermarket ERP</h2>
        <button
          style={styles.modeBtn}
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </header>

      {/* ================= LOGIN CARD ================= */}
      <div style={darkMode ? styles.cardDark : styles.card}>
        <h3 style={darkMode ? styles.titleDark : styles.title}>
          Login to your account
        </h3>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input
            style={darkMode ? styles.inputDark : styles.input}
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label style={styles.label}>Password</label>
          <div style={styles.passwordWrapper}>
            <input
              style={darkMode ? styles.inputDark : styles.input}
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              style={styles.eye}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <button style={styles.button} type="submit">
            Login
          </button>
        </form>
      </div>

      {/* ================= FOOTER ================= */}
      <footer style={styles.appFooter}>
        © {new Date().getFullYear()} Supermarket ERP • Secure Login
      </footer>
    </div>
  );
};

export default Login;

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    background: "#f1f5f9",
  },

  pageDark: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    background: "#020617",
  },

  appHeader: {
    padding: "14px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#1e293b",
    color: "#fff",
  },

  appTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "700",
  },

  appFooter: {
    textAlign: "center",
    padding: "12px",
    fontSize: "13px",
    color: "#64748b",
    background: "#f8fafc",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    margin: "auto",
    background: "#ffffff",
    padding: "32px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  },

  cardDark: {
    width: "100%",
    maxWidth: "420px",
    margin: "auto",
    background: "#020617",
    padding: "32px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
  },

  title: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "20px",
    textAlign: "center",
  },

  titleDark: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#e5e7eb",
    marginBottom: "20px",
    textAlign: "center",
  },

  label: {
    fontSize: "13px",
    marginBottom: "6px",
    color: "#64748b",
  },

  errorBox: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "10px",
    borderRadius: "6px",
    fontSize: "14px",
    marginBottom: "12px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
  },

  input: {
    padding: "11px",
    borderRadius: "6px",
    border: "1px solid #cbd5f5",
    fontSize: "14px",
    marginBottom: "14px",
  },

  inputDark: {
    padding: "11px",
    borderRadius: "6px",
    border: "1px solid #334155",
    background: "#020617",
    color: "#e5e7eb",
    fontSize: "14px",
    marginBottom: "14px",
  },

  passwordWrapper: {
    position: "relative",
  },

  eye: {
    position: "absolute",
    right: "10px",
    top: "11px",
    fontSize: "12px",
    color: "#6366f1",
    cursor: "pointer",
  },

  button: {
    marginTop: "10px",
    padding: "12px",
    borderRadius: "6px",
    border: "none",
    background: "#4f46e5",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },

  modeBtn: {
    border: "none",
    background: "transparent",
    fontSize: "14px",
    color: "#fff",
    cursor: "pointer",
  },
};
