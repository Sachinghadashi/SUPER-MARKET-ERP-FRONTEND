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

      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/cashier");
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div style={darkMode ? styles.pageDark : styles.page}>
      <div style={darkMode ? styles.cardDark : styles.card}>
        
        {/* Dark Mode Toggle */}
        <div style={styles.darkToggle} onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </div>

        <h1 style={styles.logo}>🛒</h1>
        <h2 style={darkMode ? styles.titleDark : styles.title}>
          Supermarket ERP
        </h2>
        <p style={styles.subtitle}>Sign in to continue</p>

        {/* Error Message */}
        {error && <div style={styles.errorBox}>❌ {error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          
          <input
            style={darkMode ? styles.inputDark : styles.input}
            type="email"
            placeholder="📧 Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password Field */}
          <div style={styles.passwordWrapper}>
            <input
              style={darkMode ? styles.inputDark : styles.input}
              type={showPassword ? "text" : "password"}
              placeholder="🔒 Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <span
              style={styles.eye}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button style={styles.button} type="submit">
            Login
          </button>
        </form>

        <p style={styles.registerText}>
          Don’t have an account?
          <a href="/register" style={styles.link}> Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    background: "linear-gradient(135deg, #6366f1, #3b82f6)",
  },

  pageDark: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    background: "linear-gradient(135deg, #0f172a, #020617)",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#ffffff",
    padding: "35px 30px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    position: "relative",
  },

  cardDark: {
    width: "100%",
    maxWidth: "420px",
    background: "#020617",
    padding: "35px 30px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
    position: "relative",
  },

  darkToggle: {
    position: "absolute",
    top: "15px",
    right: "15px",
    fontSize: "13px",
    cursor: "pointer",
    color: "#a5b4fc",
  },

  logo: {
    fontSize: "46px",
    marginBottom: "8px",
  },

  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827",
  },

  titleDark: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#e5e7eb",
  },

  subtitle: {
    fontSize: "14px",
    color: "#9ca3af",
    marginBottom: "18px",
  },

  errorBox: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "10px",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "15px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
  },

  inputDark: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#020617",
    color: "#e5e7eb",
    fontSize: "15px",
  },

  passwordWrapper: {
    position: "relative",
  },

  eye: {
    position: "absolute",
    right: "12px",
    top: "12px",
    cursor: "pointer",
    fontSize: "18px",
  },

  button: {
    marginTop: "10px",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #4f46e5, #3b82f6)",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },

  registerText: {
    marginTop: "18px",
    fontSize: "14px",
    color: "#9ca3af",
  },

  link: {
    color: "#6366f1",
    fontWeight: "600",
    textDecoration: "none",
  },
};
