import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "cashier",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await API.post("/auth/register", form);
      setSuccess("User registered successfully");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError("Registration failed. Try again.");
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
        <p style={styles.subtitle}>Create a new user account</p>

        {/* Messages */}
        {error && <div style={styles.errorBox}>❌ {error}</div>}
        {success && <div style={styles.successBox}>✅ {success}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={darkMode ? styles.inputDark : styles.input}
            name="name"
            placeholder="👤 Full Name"
            onChange={handleChange}
            required
          />

          <input
            style={darkMode ? styles.inputDark : styles.input}
            type="email"
            name="email"
            placeholder="📧 Email Address"
            onChange={handleChange}
            required
          />

          {/* Password */}
          <div style={styles.passwordWrapper}>
            <input
              style={darkMode ? styles.inputDark : styles.input}
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="🔒 Password"
              onChange={handleChange}
              required
            />
            <span
              style={styles.eye}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <select
            style={darkMode ? styles.selectDark : styles.select}
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="cashier">Cashier</option>
            <option value="admin">Admin</option>
          </select>

          <button style={styles.button} type="submit">
            Register
          </button>
        </form>

        <p style={styles.loginText}>
          Already have an account?
          <a href="/login" style={styles.link}> Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    background: "linear-gradient(135deg, #22c55e, #3b82f6)",
  },

  pageDark: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    background: "linear-gradient(135deg, #020617, #0f172a)",
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
    marginBottom: "12px",
  },

  successBox: {
    background: "#dcfce7",
    color: "#166534",
    padding: "10px",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "12px",
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

  select: {
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
    background: "#fff",
  },

  selectDark: {
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "1px solid #334155",
    fontSize: "15px",
    background: "#020617",
    color: "#e5e7eb",
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
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },

  loginText: {
    marginTop: "18px",
    fontSize: "14px",
    color: "#9ca3af",
  },

  link: {
    color: "#22c55e",
    fontWeight: "600",
    textDecoration: "none",
  },
};
