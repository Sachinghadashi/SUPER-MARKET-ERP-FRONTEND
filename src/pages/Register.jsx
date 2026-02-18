import { useState } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";

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

      setSuccess("✅ User registered successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch {
      setError("❌ Registration failed. Try again.");
    }
  };

  return (
    <div style={darkMode ? styles.pageDark : styles.page}>
      <div style={darkMode ? styles.cardDark : styles.card}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={darkMode ? styles.titleDark : styles.title}>
              🏪 Supermarket ERP
            </h2>
            <p style={styles.subtitle}>Create New Account</p>
          </div>

          <button
            style={styles.modeBtn}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Messages */}
        {error && <div style={styles.errorBox}>{error}</div>}
        {success && <div style={styles.successBox}>{success}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>

          <label style={styles.label}>Full Name</label>
          <input
            style={darkMode ? styles.inputDark : styles.input}
            name="name"
            placeholder="Enter full name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label style={styles.label}>Email</label>
          <input
            style={darkMode ? styles.inputDark : styles.input}
            type="email"
            name="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label style={styles.label}>Password</label>

          <div style={styles.passwordWrapper}>
            <input
              style={darkMode ? styles.inputDark : styles.input}
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <span
              style={styles.eye}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <label style={styles.label}>Role</label>

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
            ➕ Create User
          </button>

        </form>

        {/* Footer */}
        <p style={styles.footer}>
          Already registered?{" "}
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;

/* ================= STYLES ================= */

const styles = {

  /* Page */

  page: {
    minHeight: "100vh",
    padding: "16px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f1f5f9",
  },

  pageDark: {
    minHeight: "100vh",
    padding: "16px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#020617",
  },

  /* Card */

  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#ffffff",
    padding: "26px",
    borderRadius: "14px",
    boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
  },

  cardDark: {
    width: "100%",
    maxWidth: "420px",
    background: "#020617",
    padding: "26px",
    borderRadius: "14px",
    boxShadow: "0 12px 28px rgba(0,0,0,0.5)",
  },

  /* Header */

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
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

  modeBtn: {
    border: "none",
    background: "transparent",
    fontSize: "18px",
    cursor: "pointer",
  },

  /* Form */

  form: {
    display: "flex",
    flexDirection: "column",
  },

  label: {
    fontSize: "13px",
    marginBottom: "5px",
    color: "#64748b",
  },

  input: {
    padding: "12px",
    borderRadius: "7px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    marginBottom: "14px",
  },

  inputDark: {
    padding: "12px",
    borderRadius: "7px",
    border: "1px solid #334155",
    background: "#020617",
    color: "#fff",
    fontSize: "14px",
    marginBottom: "14px",
  },

  select: {
    padding: "12px",
    borderRadius: "7px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    marginBottom: "18px",
  },

  selectDark: {
    padding: "12px",
    borderRadius: "7px",
    border: "1px solid #334155",
    background: "#020617",
    color: "#fff",
    fontSize: "14px",
    marginBottom: "18px",
  },

  passwordWrapper: {
    position: "relative",
  },

  eye: {
    position: "absolute",
    right: "12px",
    top: "12px",
    fontSize: "12px",
    color: "#6366f1",
    cursor: "pointer",
  },

  /* Button */

  button: {
    padding: "13px",
    borderRadius: "8px",
    border: "none",
    background: "#4f46e5",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },

  /* Messages */

  errorBox: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "10px",
    borderRadius: "6px",
    fontSize: "13px",
    marginBottom: "12px",
  },

  successBox: {
    background: "#dcfce7",
    color: "#166534",
    padding: "10px",
    borderRadius: "6px",
    fontSize: "13px",
    marginBottom: "12px",
  },

  /* Footer */

  footer: {
    marginTop: "18px",
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
