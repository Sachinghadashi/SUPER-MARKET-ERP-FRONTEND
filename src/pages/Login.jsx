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

  /* ================= REMEMBER ME ================= */

  useEffect(() => {
    const saved = localStorage.getItem("rememberUser");

    if (saved) {
      const data = JSON.parse(saved);
      setEmail(data.email);
      setPassword(data.password);
      setRemember(true);
    }
  }, []);

  /* ================= LOGIN ================= */

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
      setError("❌ Invalid email or password");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      {/* ================= HEADER ================= */}

      <nav className="navbar navbar-dark bg-dark px-3">
        <span className="navbar-brand fw-bold">
          🏪 Dilraj Kirana Store Management System
        </span>
      </nav>

      {/* ================= MAIN ================= */}

      <div className="container flex-grow-1 d-flex justify-content-center align-items-center">
        <div className="row w-100 justify-content-center">
          <div className="col-12 col-sm-10 col-md-6 col-lg-4">
            <div className="card shadow-lg border-0 rounded-4 p-4">
              <h3 className="text-center fw-bold mb-2">
                Welcome To Dilraj Kirana Store
              </h3>

              <p className="text-center text-muted mb-4">
                Login to continue
              </p>

              {/* ERROR */}
              {error && (
                <div className="alert alert-danger py-2 text-center">
                  {error}
                </div>
              )}

              {/* FORM */}
              <form onSubmit={handleSubmit}>
                {/* EMAIL */}
                <div className="mb-3">
                  <label className="form-label">
                    Email
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                  />
                </div>

                {/* PASSWORD */}
                <div className="mb-3">
                  <label className="form-label">
                    Password
                  </label>

                  <div className="input-group">
                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      className="form-control"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      required
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                {/* REMEMBER */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={remember}
                      onChange={() =>
                        setRemember(!remember)
                      }
                      id="remember"
                    />

                    <label
                      className="form-check-label"
                      htmlFor="remember"
                    >
                      Remember Me
                    </label>
                  </div>

                  {/* FUTURE: Forgot password */}
                  {/* <span className="text-muted small">
                    🔥 Forgot?
                  </span> */}
                </div>

                {/* LOGIN BUTTON */}
                <button
                  type="submit"
                  className="btn btn-primary w-100 fw-bold py-2"
                >
                  🔐 Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ================= FOOTER ================= */}

      <footer className="bg-white text-center py-2 small text-muted border-top">
        © {new Date().getFullYear()} Dilraj
        Kirana Store
        <br />
        Built with ❤️ by Prabhakar
        Technologies
      </footer>
    </div>
  );
};

export default Login;