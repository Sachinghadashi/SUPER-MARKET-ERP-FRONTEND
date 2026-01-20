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
    } catch {
      setError("Registration failed. Please try again.");
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
            <p style={styles.subtitle}>Create User Account</p>
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

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Full Name</label>
          <input
            style={darkMode ? styles.inputDark : styles.input}
            name="name"
            placeholder="Enter full name"
            onChange={handleChange}
            required
          />

          <label style={styles.label}>Email</label>
          <input
            style={darkMode ? styles.inputDark : styles.input}
            type="email"
            name="email"
            placeholder="Enter email address"
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
            Create User
          </button>
        </form>

        <p style={styles.footer}>
          Already registered? <a href="/login" style={styles.link}>Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;


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
    maxWidth: "440px",
    background: "#ffffff",
    padding: "32px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  },

  cardDark: {
    width: "100%",
    maxWidth: "440px",
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
    textAlign: "left",
  },

  errorBox: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "10px",
    borderRadius: "6px",
    fontSize: "14px",
    marginBottom: "12px",
  },

  successBox: {
    background: "#dcfce7",
    color: "#166534",
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

  select: {
    padding: "11px",
    borderRadius: "6px",
    border: "1px solid #cbd5f5",
    fontSize: "14px",
    marginBottom: "18px",
    background: "#fff",
  },

  selectDark: {
    padding: "11px",
    borderRadius: "6px",
    border: "1px solid #334155",
    fontSize: "14px",
    marginBottom: "18px",
    background: "#020617",
    color: "#e5e7eb",
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
