import { useEffect, useState } from "react";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DailySalesChart from "../components/DailySalesChart";

const POWER_BI_URL =
  "https://app.powerbi.com/view?r=YOUR_POWER_BI_LINK";

const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalBills: 0,
  });

  const [dateWise, setDateWise] = useState([]);
  const [monthWise, setMonthWise] = useState([]);
  const [yearWise, setYearWise] = useState([]);

  const [dateFilter, setDateFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  const [loading, setLoading] = useState(true);

  /* ================= LOAD REPORTS ================= */

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);

      const [totalRes, dateRes, monthRes, yearRes] =
        await Promise.all([
          API.get("/reports/total"),
          API.get("/reports/date"),
          API.get("/reports/month"),
          API.get("/reports/year"),
        ]);

      setSummary(totalRes.data);
      setDateWise(dateRes.data);
      setMonthWise(monthRes.data);
      setYearWise(yearRes.data);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="container-fluid bg-light min-vh-100 p-3">

      {/* ================= HEADER ================= */}

      <div className="card shadow-sm border-0 rounded-4 mb-4">

        <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center">

          <div>
            <h3 className="fw-bold text-primary mb-1">
              📊 Admin Dashboard
            </h3>

            <p className="text-muted mb-0">
              Logged in as <b>{user?.name}</b>
            </p>
          </div>

          <div className="d-flex flex-wrap gap-2 mt-3 mt-md-0">

            <button
              onClick={() => navigate("/products")}
              className="btn btn-primary"
            >
              📦 Products Management
            </button>

            <button
              onClick={() => navigate("/bills")}
              className="btn btn-success"
            >
              🧾 View All Bills
            </button>

            {/* <button
              onClick={logout}
              className="btn btn-outline-danger"
            >
              ⏻ Logout
            </button> */}

          </div>

        </div>
      </div>

      {/* ================= LOADING ================= */}

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
          <p className="mt-2">Loading reports...</p>
        </div>
      )}

      {!loading && (
        <>

          {/* ================= SUMMARY ================= */}

          <div className="row g-3 mb-4">

            {/* Chart */}
            <div className="col-12 col-lg-6">
              <div className="card shadow-sm border-0 rounded-4 h-100">

                <div className="card-header bg-primary text-white fw-bold rounded-top-4">
                  📈 Daily Sales Chart
                </div>

                <div className="card-body">
                  <DailySalesChart data={dateWise} />
                </div>

              </div>
            </div>

            {/* Revenue */}
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card shadow-sm border-0 rounded-4 text-center h-100">

                <div className="card-body">
                  <h6 className="text-muted">
                    Total Revenue
                  </h6>

                  <h3 className="fw-bold text-success">
                    ₹{summary.totalRevenue}
                  </h3>
                </div>

              </div>
            </div>

            {/* Bills */}
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card shadow-sm border-0 rounded-4 text-center h-100">

                <div className="card-body">
                  <h6 className="text-muted">
                    Total Bills
                  </h6>

                  <h3 className="fw-bold text-primary">
                    {summary.totalBills}
                  </h3>
                </div>

              </div>
            </div>

          </div>

          {/* ================= DATE WISE ================= */}

          <div className="card shadow-sm border-0 rounded-4 mb-4">

            <div className="card-body">

              <h5 className="fw-bold mb-3">
                📅 Date-wise Sales
              </h5>

              <input
                type="date"
                className="form-control mb-3"
                value={dateFilter}
                onChange={(e) =>
                  setDateFilter(e.target.value)
                }
              />

              <div className="table-responsive">

                <table className="table table-bordered text-center">

                  <thead className="table-dark">
                    <tr>
                      <th>Date</th>
                      <th>Revenue (₹)</th>
                    </tr>
                  </thead>

                  <tbody>
                    {(dateFilter
                      ? dateWise.filter(
                          (d) => d._id === dateFilter
                        )
                      : dateWise
                    ).map((d) => (
                      <tr key={d._id}>
                        <td>{d._id}</td>
                        <td>₹{d.totalRevenue}</td>
                      </tr>
                    ))}
                  </tbody>

                </table>

              </div>

            </div>
          </div>

          {/* ================= MONTH WISE ================= */}

          <div className="card shadow-sm border-0 rounded-4 mb-4">

            <div className="card-body">

              <h5 className="fw-bold mb-3">
                📆 Month-wise Sales
              </h5>

              <input
                type="month"
                className="form-control mb-3"
                value={monthFilter}
                onChange={(e) =>
                  setMonthFilter(e.target.value)
                }
              />

              <div className="table-responsive">

                <table className="table table-bordered text-center">

                  <thead className="table-dark">
                    <tr>
                      <th>Month</th>
                      <th>Revenue (₹)</th>
                    </tr>
                  </thead>

                  <tbody>
                    {(monthFilter
                      ? monthWise.filter(
                          (m) =>
                            `${m._id.year}-${String(
                              m._id.month
                            ).padStart(2, "0")}` ===
                            monthFilter
                        )
                      : monthWise
                    ).map((m, i) => (
                      <tr key={i}>
                        <td>
                          {m._id.month}/{m._id.year}
                        </td>
                        <td>₹{m.totalRevenue}</td>
                      </tr>
                    ))}
                  </tbody>

                </table>

              </div>

            </div>
          </div>

          {/* ================= YEAR WISE ================= */}

          <div className="card shadow-sm border-0 rounded-4 mb-4">

            <div className="card-body">

              <h5 className="fw-bold mb-3">
                📊 Year-wise Sales
              </h5>

              <input
                type="number"
                placeholder="Enter Year"
                className="form-control mb-3"
                value={yearFilter}
                onChange={(e) =>
                  setYearFilter(e.target.value)
                }
              />

              <div className="table-responsive">

                <table className="table table-bordered text-center">

                  <thead className="table-dark">
                    <tr>
                      <th>Year</th>
                      <th>Revenue (₹)</th>
                    </tr>
                  </thead>

                  <tbody>
                    {(yearFilter
                      ? yearWise.filter(
                          (y) =>
                            String(y._id.year) ===
                            yearFilter
                        )
                      : yearWise
                    ).map((y) => (
                      <tr key={y._id.year}>
                        <td>{y._id.year}</td>
                        <td>₹{y.totalRevenue}</td>
                      </tr>
                    ))}
                  </tbody>

                </table>

              </div>

            </div>
          </div>

        </>
      )}

    </div>
  );
};

export default AdminDashboard;