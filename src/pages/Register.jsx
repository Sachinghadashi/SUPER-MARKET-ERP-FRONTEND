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
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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
    <div
      className={`min-vh-100 d-flex flex-column ${
        darkMode ? "bg-dark text-light" : "bg-light"
      }`}
    >
      {/* HEADER */}
      <nav
        className={`navbar ${
          darkMode
            ? "navbar-dark bg-black"
            : "navbar-dark bg-dark"
        } px-3`}
      >
        <span className="navbar-brand fw-bold">
          🏪 Dilraj Kirana Store Management System
        </span>

        <button
          className="btn btn-sm btn-outline-light"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </nav>

      {/* MAIN */}
      <div className="container flex-grow-1 d-flex justify-content-center align-items-center">
        <div className="row w-100 justify-content-center">
          <div className="col-12 col-sm-10 col-md-6 col-lg-4">
            <div
              className={`card shadow-lg border-0 rounded-4 p-4 ${
                darkMode
                  ? "bg-dark text-light"
                  : ""
              }`}
            >
              <h3 className="text-center fw-bold mb-2">
                Create Account
              </h3>

              <p className="text-center text-muted mb-4">
                Add new user to system
              </p>

              {/* Messages */}
              {error && (
                <div className="alert alert-danger py-2 text-center">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success py-2 text-center">
                  {success}
                </div>
              )}

              {/* FORM */}
              <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className="mb-3">
                  <label className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    placeholder="Enter full name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Enter email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Password */}
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
                      name="password"
                      placeholder="Enter password"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                    >
                      {showPassword
                        ? "🙈"
                        : "👁️"}
                    </button>
                  </div>
                </div>

                {/* Role */}
                <div className="mb-3">
                  <label className="form-label">
                    Role
                  </label>
                  <select
                    className="form-select"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                  >
                    <option value="cashier">
                      Cashier
                    </option>
                    <option value="admin">
                      Admin
                    </option>
                  </select>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn btn-primary w-100 fw-bold"
                >
                  ➕ Create User
                </button>
              </form>

              {/* Footer Link */}
              <div className="text-center mt-3 small">
                Already registered?{" "}
                <Link to="/login">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
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

export default Register;