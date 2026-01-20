import { useState } from "react";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

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
      <div style={darkMode ? styles.cardDark : styles.card}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={darkMode ? styles.titleDark : styles.title}>
              Supermarket ERP
            </h2>
            <p style={styles.subtitle}>Login to your account</p>
          </div>

          <button
            style={styles.modeBtn}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

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

        {/* Register Option */}
        <p style={styles.footer}>
          Don’t have an account?{" "}
          <Link to="/register" style={styles.link}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;


const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f1f5f9",
  },

  pageDark: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#020617",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#ffffff",
    padding: "32px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  },

  cardDark: {
    width: "100%",
    maxWidth: "420px",
    background: "#020617",
    padding: "32px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "22px",
  },

  modeBtn: {
    border: "none",
    background: "transparent",
    fontSize: "18px",
    cursor: "pointer",
  },

  title: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#0f172a",
  },

  titleDark: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#e5e7eb",
  },

  subtitle: {
    fontSize: "13px",
    color: "#64748b",
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
    marginTop: "6px",
    padding: "12px",
    borderRadius: "6px",
    border: "none",
    background: "#4f46e5",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },

  footer: {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "13px",
    color: "#64748b",
  },

  link: {
    color: "#4f46e5",
    fontWeight: "600",
    textDecoration: "none",
  },
};
