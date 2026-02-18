import { useState, useEffect } from "react";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  /* Remember Me */
  useEffect(() => {
    const saved = localStorage.getItem("rememberUser");
    if (saved) {
      const data = JSON.parse(saved);
      setEmail(data.email);
      setPassword(data.password);
      setRemember(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      login(res.data);

      if (remember) {
        localStorage.setItem(
          "rememberUser",
          JSON.stringify({ email, password })
        );
      } else {
        localStorage.removeItem("rememberUser");
      }

      if (res.data.role === "admin") navigate("/admin");
      else navigate("/cashier");
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div style={styles.page}>
      {/* ================= HEADER ================= */}
      <header style={styles.header}>
        <div style={styles.headerContainer}>
          <h2 style={styles.logo}>
            🏪 Supermarket ERP
          </h2>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main style={styles.main}>
        <div style={styles.card}>
          <h3 style={styles.title}>
            Welcome Back 👋
          </h3>

          {error && (
            <div style={styles.error}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label>Password</label>

              <div style={styles.passwordBox}>
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

                <span
                  style={styles.eye}
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
            </div>

            <div style={styles.row}>
              <label>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() =>
                    setRemember(!remember)
                  }
                />{" "}
                Remember Me
              </label>
            </div>

            <button
              type="submit"
              style={styles.loginBtn}
            >
              🔐 Login
            </button>
          </form>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          © {new Date().getFullYear()} Dilraj
          Kirana Store
          <br />
          Built with ❤️ by Prabhakar
          Technologies
        </div>
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
    background:
      "linear-gradient(135deg, #2563eb, #0f172a)",
  },

  /* HEADER */
  header: {
    background: "#0f172a",
    padding: "14px 20px",
  },

  headerContainer: {
    maxWidth: 1200,
    margin: "0 auto",
  },

  logo: {
    color: "#fff",
    fontSize: 20,
    fontWeight: 700,
    margin: 0,
  },

  /* MAIN */
  main: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  /* CARD */
  card: {
    width: "100%",
    maxWidth: 380,
    background: "#ffffff",
    padding: 30,
    borderRadius: 16,
    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
  },

  title: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 22,
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 16,
  },

  passwordBox: {
    position: "relative",
  },

  eye: {
    position: "absolute",
    right: 10,
    top: 10,
    cursor: "pointer",
  },

  row: {
    marginBottom: 16,
    fontSize: 13,
  },

  loginBtn: {
    width: "100%",
    padding: 14,
    borderRadius: 8,
    border: "none",
    background:
      "linear-gradient(to right, #4f46e5, #2563eb)",
    color: "#fff",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
  },

  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
    textAlign: "center",
    fontSize: 13,
  },

  /* FOOTER */
  footer: {
    background: "#0f172a",
    color: "#94a3b8",
    textAlign: "center",
    padding: 14,
    fontSize: 12,
  },

  footerContainer: {
    maxWidth: 1200,
    margin: "0 auto",
  },
};
