import Billing from "./Billing";
import TodayBills from "../components/TodayBills";
import MyBillsHistory from "../components/MyBillsHistory";

import { useAuth } from "../context/AuthContext";

const CashierDashboard = () => {
  const { logout, user } = useAuth();

  return (
    <div className="container-fluid bg-light min-vh-100 p-3">

      {/* ================= HEADER ================= */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">

        <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center">

          {/* Title */}
          <div>
            <h3 className="fw-bold mb-1 text-primary">
              💳 Cashier Dashboard
            </h3>

            <p className="text-muted mb-0">
              Welcome, <b>{user?.name}</b>
            </p>
          </div>

          {/* Logout */}
          {/* <button
            className="btn btn-outline-danger mt-3 mt-md-0"
            onClick={logout}
          >
            ⏻ Logout
          </button> */}

        </div>
      </div>

      {/* ================= BILLING ================= */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">

        <div className="card-body p-3 p-md-4">
          <Billing />
        </div>

      </div>

      {/* ================= TODAY BILLS ================= */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">

        <div className="card-header bg-primary text-white fw-bold rounded-top-4">
          📅 Today’s Bills
        </div>

        <div className="card-body p-3 p-md-4">
          <TodayBills />
        </div>

      </div>

      {/* ================= HISTORY ================= */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">

        <div className="card-header bg-success text-white fw-bold rounded-top-4">
          📜 My Bills History
        </div>

        <div className="card-body p-3 p-md-4">
          <MyBillsHistory />
        </div>

      </div>

    </div>
  );
};

export default CashierDashboard;