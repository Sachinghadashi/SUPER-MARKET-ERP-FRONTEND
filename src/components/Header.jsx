import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header
      style={{
        background: "#1e293b",
        color: "#fff",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Logo / Title */}
      <div
        style={{ fontSize: 20, fontWeight: "bold", cursor: "pointer" }}
        onClick={() =>
          navigate(user?.role === "admin" ? "/admin" : "/cashier")
        }
      >
        🏪 DILRAJ KIRANA STORE
      </div>

      {/* User Info */}
      <div>
        <span style={{ marginRight: 15 }}>
          👤 {user?.name} ({user?.role})
        </span>

        {/* <button onClick={logout}>Logout</button> */}
      </div>
    </header>
  );
};

export default Header;
