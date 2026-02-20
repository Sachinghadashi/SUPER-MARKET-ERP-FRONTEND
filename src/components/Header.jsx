import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top px-3">

      {/* ================= LOGO ================= */}
      <span
        className="navbar-brand fw-bold"
        style={{ cursor: "pointer" }}
        onClick={() =>
          navigate(user?.role === "admin" ? "/admin" : "/cashier")
        }
      >
        🏪 Dilraj Kirana Store Mnagement System
      </span>

      {/* ================= TOGGLER (MOBILE) ================= */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNavbar"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* ================= RIGHT SIDE ================= */}
      <div
        className="collapse navbar-collapse justify-content-end"
        id="mainNavbar"
      >
        <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">

          {/* USER INFO */}
          <span className="text-white fw-semibold">
            👤 {user?.name}
            <span className="text-secondary ms-1">
              ({user?.role})
            </span>
          </span>

          {/* LOGOUT */}
          <button
            onClick={logout}
            className="btn btn-outline-danger btn-sm fw-bold"
            title="Logout"
          >
            ⏻
          </button>

        </div>
      </div>

    </nav>
  );
};

export default Header;