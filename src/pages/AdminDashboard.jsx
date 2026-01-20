import { useEffect, useState } from "react";
import API from "../api/api";
import Products from "./Products";
import BillHistory from "./BillHistory";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const { logout } = useAuth();

  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalBills: 0,
  });

  const [dateWise, setDateWise] = useState([]);
  const [monthWise, setMonthWise] = useState([]);
  const [yearWise, setYearWise] = useState([]);

  // 🔎 Filters
  const [dateFilter, setDateFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const totalRes = await API.get("/reports/total");
      const dateRes = await API.get("/reports/date");
      const monthRes = await API.get("/reports/month");
      const yearRes = await API.get("/reports/year");

      setSummary(totalRes.data);
      setDateWise(dateRes.data);
      setMonthWise(monthRes.data);
      setYearWise(yearRes.data);
    } catch {
      alert("Failed to load reports");
    }
  };

  // 🔎 Apply filters
  const filteredDateWise = dateFilter
    ? dateWise.filter((d) => d._id === dateFilter)
    : dateWise;

  const filteredMonthWise = monthFilter
    ? monthWise.filter(
        (m) =>
          `${m._id.year}-${String(m._id.month).padStart(2, "0")}` ===
          monthFilter
      )
    : monthWise;

  const filteredYearWise = yearFilter
    ? yearWise.filter((y) => String(y._id.year) === yearFilter)
    : yearWise;

  return (
    <div style={{ padding: 20 }}>
      <h1>📊 Admin Dashboard</h1>
      <button onClick={logout}>Logout</button>

      <hr />

      {/* ================= SUMMARY ================= */}
      <div style={{ display: "flex", gap: 40 }}>
        <div>
          <h3>💰 Total Revenue</h3>
          <h2>₹{summary.totalRevenue}</h2>
        </div>
        <div>
          <h3>🧾 Total Bills</h3>
          <h2>{summary.totalBills}</h2>
        </div>
      </div>

      <hr />

      {/* ================= DATE WISE ================= */}
      <h3>📅 Date-wise Sales</h3>
      <input
        type="date"
        value={dateFilter}
        onChange={(e) => setDateFilter(e.target.value)}
      />

      <table border="1" cellPadding="6" width="50%">
        <thead>
          <tr>
            <th>Date</th>
            <th>Revenue (₹)</th>
          </tr>
        </thead>
        <tbody>
          {filteredDateWise.map((d) => (
            <tr key={d._id}>
              <td>{d._id}</td>
              <td>₹{d.totalRevenue}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      {/* ================= MONTH WISE ================= */}
      <h3>📆 Month-wise Sales</h3>
      <input
        type="month"
        value={monthFilter}
        onChange={(e) => setMonthFilter(e.target.value)}
      />

      <table border="1" cellPadding="6" width="50%">
        <thead>
          <tr>
            <th>Month / Year</th>
            <th>Revenue (₹)</th>
          </tr>
        </thead>
        <tbody>
          {filteredMonthWise.map((m, index) => (
            <tr key={index}>
              <td>
                {m._id.month}/{m._id.year}
              </td>
              <td>₹{m.totalRevenue}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      {/* ================= YEAR WISE ================= */}
      <h3>📈 Year-wise Sales</h3>
      <input
        type="number"
        placeholder="Enter year (e.g. 2025)"
        value={yearFilter}
        onChange={(e) => setYearFilter(e.target.value)}
      />

      <table border="1" cellPadding="6" width="50%">
        <thead>
          <tr>
            <th>Year</th>
            <th>Revenue (₹)</th>
          </tr>
        </thead>
        <tbody>
          {filteredYearWise.map((y) => (
            <tr key={y._id.year}>
              <td>{y._id.year}</td>
              <td>₹{y.totalRevenue}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      {/* ================= PRODUCT MANAGEMENT ================= */}
      <h2>📦 Product Management</h2>
      <Products />
    </div>
  );
};

export default AdminDashboard;
