import { useEffect, useState } from "react";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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

  /* ================= POWER BI ================= */

  const openPowerBI = () => {
    window.open(POWER_BI_URL, "_blank");
  };

  /* ================= FILTERS ================= */

  const filteredDateWise = dateFilter
    ? dateWise.filter((d) => d._id === dateFilter)
    : dateWise;

  const filteredMonthWise = monthFilter
    ? monthWise.filter(
        (m) =>
          `${m._id.year}-${String(m._id.month).padStart(
            2,
            "0"
          )}` === monthFilter
      )
    : monthWise;

  const filteredYearWise = yearFilter
    ? yearWise.filter(
        (y) => String(y._id.year) === yearFilter
      )
    : yearWise;

  /* ================= UI ================= */

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Admin Dashboard
          </h1>

          <p style={styles.subtitle}>
            Logged in as <b>{user?.name}</b>
          </p>
        </div>

        <div style={styles.btnGroup}>
          <button
            onClick={() => navigate("/products")}
            style={styles.primaryBtn}
          >
            📦 Products
          </button>

          <button
            onClick={() => navigate("/bills")}
            style={styles.billsBtn}
          >
            🧾 All Bills
          </button>

          {/* TODAY BILLS */}
          <button
            onClick={() =>
              navigate("/bills", {
                state: { today: true },
              })
            }
            style={styles.todayBtn}
          >
            📅 Today Bills
          </button>

          <button
            onClick={openPowerBI}
            style={styles.powerBiBtn}
          >
            📊 Power BI
          </button>

          <button
            style={styles.logoutBtn}
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* LOADING */}
      {loading && <p>Loading reports...</p>}

      {!loading && (
        <>
          {/* Summary */}
          <div style={styles.summaryGrid}>
            <div style={styles.summaryCard}>
              <p>Total Revenue</p>
              <h2>₹{summary.totalRevenue}</h2>
            </div>

            <div style={styles.summaryCard}>
              <p>Total Bills</p>
              <h2>{summary.totalBills}</h2>
            </div>
          </div>

          {/* Date Wise */}
          <div style={styles.card}>
            <h3>Date-wise Sales</h3>

            <input
              type="date"
              value={dateFilter}
              onChange={(e) =>
                setDateFilter(e.target.value)
              }
              style={styles.filterInput}
            />

            <table style={styles.table}>
              <tbody>
                {filteredDateWise.map((d) => (
                  <tr key={d._id}>
                    <td>{d._id}</td>
                    <td>₹{d.totalRevenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Month Wise */}
          <div style={styles.card}>
            <h3>Month-wise Sales</h3>

            <input
              type="month"
              value={monthFilter}
              onChange={(e) =>
                setMonthFilter(e.target.value)
              }
              style={styles.filterInput}
            />

            <table style={styles.table}>
              <tbody>
                {filteredMonthWise.map((m, i) => (
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

          {/* Year Wise */}
          <div style={styles.card}>
            <h3>Year-wise Sales</h3>

            <input
              type="number"
              placeholder="Year"
              value={yearFilter}
              onChange={(e) =>
                setYearFilter(e.target.value)
              }
              style={styles.filterInput}
            />

            <table style={styles.table}>
              <tbody>
                {filteredYearWise.map((y) => (
                  <tr key={y._id.year}>
                    <td>{y._id.year}</td>
                    <td>₹{y.totalRevenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;

/* ================= STYLES ================= */

const styles = {
  page: {
    padding: 20,
    background: "#f1f5f9",
    minHeight: "100vh",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 20,
  },

  btnGroup: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },

  title: {
    fontSize: 26,
  },

  subtitle: {
    fontSize: 13,
    color: "#64748b",
  },

  primaryBtn: {
    background: "#2563eb",
    color: "#fff",
    padding: "8px 14px",
    border: "none",
    borderRadius: 6,
  },

  billsBtn: {
    background: "#059669",
    color: "#fff",
    padding: "8px 14px",
    border: "none",
    borderRadius: 6,
  },

  todayBtn: {
    background: "#0ea5e9",
    color: "#fff",
    padding: "8px 14px",
    border: "none",
    borderRadius: 6,
  },

  powerBiBtn: {
    background: "#f59e0b",
    color: "#fff",
    padding: "8px 14px",
    border: "none",
    borderRadius: 6,
  },

  logoutBtn: {
    background: "#dc2626",
    color: "#fff",
    padding: "8px 14px",
    border: "none",
    borderRadius: 6,
  },

  summaryGrid: {
    display: "flex",
    gap: 20,
    marginBottom: 20,
  },

  summaryCard: {
    background: "#fff",
    padding: 16,
    borderRadius: 8,
    flex: 1,
  },

  card: {
    background: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },

  filterInput: {
    padding: 8,
    marginBottom: 10,
  },

  table: {
    width: "100%",
  },
};



// import { useEffect, useState } from "react";
// import API from "../api/api";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// const POWER_BI_URL =
//   "https://app.powerbi.com/view?r=YOUR_POWER_BI_LINK";

// const AdminDashboard = () => {
//   const { logout, user } = useAuth();
//   const navigate = useNavigate();

//   const [summary, setSummary] = useState({
//     totalRevenue: 0,
//     totalBills: 0,
//   });

//   const [dateWise, setDateWise] = useState([]);
//   const [monthWise, setMonthWise] = useState([]);
//   const [yearWise, setYearWise] = useState([]);

//   const [dateFilter, setDateFilter] = useState("");
//   const [monthFilter, setMonthFilter] = useState("");
//   const [yearFilter, setYearFilter] = useState("");

//   useEffect(() => {
//     loadReports();
//   }, []);

//   const loadReports = async () => {
//     try {
//       const totalRes = await API.get("/reports/total");
//       const dateRes = await API.get("/reports/date");
//       const monthRes = await API.get("/reports/month");
//       const yearRes = await API.get("/reports/year");

//       setSummary(totalRes.data);
//       setDateWise(dateRes.data);
//       setMonthWise(monthRes.data);
//       setYearWise(yearRes.data);
//     } catch {
//       alert("Failed to load reports");
//     }
//   };

//   const openPowerBI = () => {
//     window.open(POWER_BI_URL, "_blank");
//   };

//   const filteredDateWise = dateFilter
//     ? dateWise.filter((d) => d._id === dateFilter)
//     : dateWise;

//   const filteredMonthWise = monthFilter
//     ? monthWise.filter(
//         (m) =>
//           `${m._id.year}-${String(m._id.month).padStart(2, "0")}` ===
//           monthFilter
//       )
//     : monthWise;

//   const filteredYearWise = yearFilter
//     ? yearWise.filter((y) => String(y._id.year) === yearFilter)
//     : yearWise;

//   return (
//     <div style={styles.page}>
//       {/* Header */}
//       <div style={styles.header}>
//         <div>
//           <h1 style={styles.title}>Admin Dashboard</h1>
//           <p style={styles.subtitle}>
//             Logged in as <b>{user?.name}</b>
//           </p>
//         </div>

//         <div style={styles.btnGroup}>
//           <button
//             onClick={() => navigate("/products")}
//             style={styles.primaryBtn}
//           >
//             📦 Products Management
//           </button>

//           <button
//             onClick={() => navigate("/bills")}
//             style={styles.billsBtn}
//           >
//             🧾 View All Bills
//           </button>

//           <button
//             onClick={() => navigate("/bills?today=true")}
//             style={styles.todayBtn}
//           >
//             📅 View Today’s Bills
//           </button>


//           <button
//             onClick={openPowerBI}
//             style={styles.powerBiBtn}
//           >
//             📊 View Power BI Report
//           </button>
//           <button style={styles.logoutBtn} onClick={logout}>
//             Logout
//           </button>
//         </div>
//       </div>

//       {/* Summary */}
//       <div style={styles.summaryGrid}>
//         <div style={styles.summaryCard}>
//           <p>Total Revenue</p>
//           <h2>₹{summary.totalRevenue}</h2>
//         </div>

//         <div style={styles.summaryCard}>
//           <p>Total Bills</p>
//           <h2>{summary.totalBills}</h2>
//         </div>
//       </div>

//       {/* Date Wise */}
//       <div style={styles.card}>
//         <h3>Date-wise Sales</h3>

//         <input
//           type="date"
//           value={dateFilter}
//           onChange={(e) => setDateFilter(e.target.value)}
//           style={styles.filterInput}
//         />

//         <table style={styles.table}>
//           <tbody>
//             {filteredDateWise.map((d) => (
//               <tr key={d._id}>
//                 <td>{d._id}</td>
//                 <td>₹{d.totalRevenue}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Month Wise */}
//       <div style={styles.card}>
//         <h3>Month-wise Sales</h3>

//         <input
//           type="month"
//           value={monthFilter}
//           onChange={(e) => setMonthFilter(e.target.value)}
//           style={styles.filterInput}
//         />

//         <table style={styles.table}>
//           <tbody>
//             {filteredMonthWise.map((m, i) => (
//               <tr key={i}>
//                 <td>
//                   {m._id.month}/{m._id.year}
//                 </td>
//                 <td>₹{m.totalRevenue}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Year Wise */}
//       <div style={styles.card}>
//         <h3>Year-wise Sales</h3>

//         <input
//           type="number"
//           value={yearFilter}
//           onChange={(e) => setYearFilter(e.target.value)}
//           style={styles.filterInput}
//         />

//         <table style={styles.table}>
//           <tbody>
//             {filteredYearWise.map((y) => (
//               <tr key={y._id.year}>
//                 <td>{y._id.year}</td>
//                 <td>₹{y.totalRevenue}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

// /* ================= STYLES ================= */

// const styles = {
//   page: {
//     padding: 20,
//     background: "#f1f5f9",
//     minHeight: "100vh",
//   },

//   header: {
//     display: "flex",
//     justifyContent: "space-between",
//     flexWrap: "wrap",
//     marginBottom: 20,
//   },

//   btnGroup: {
//     display: "flex",
//     gap: 10,
//     flexWrap: "wrap",
//   },

//   title: {
//     fontSize: 26,
//   },

//   subtitle: {
//     fontSize: 13,
//     color: "#64748b",
//   },

//   primaryBtn: {
//     background: "#2563eb",
//     color: "#fff",
//     padding: "8px 14px",
//     border: "none",
//     borderRadius: 6,
//   },

//   billsBtn: {
//     background: "#059669",
//     color: "#fff",
//     padding: "8px 14px",
//     border: "none",
//     borderRadius: 6,
//   },

//   todayBtn: {
//     background: "#0ea5e9",
//     color: "#fff",
//     padding: "8px 14px",
//     border: "none",
//     borderRadius: 6,
//   },

//   powerBiBtn: {
//     background: "#f59e0b",
//     color: "#fff",
//     padding: "8px 14px",
//     border: "none",
//     borderRadius: 6,
//   },

//   logoutBtn: {
//     background: "#dc2626",
//     color: "#fff",
//     padding: "8px 14px",
//     border: "none",
//     borderRadius: 6,
//   },

//   summaryGrid: {
//     display: "flex",
//     gap: 20,
//     marginBottom: 20,
//   },

//   summaryCard: {
//     background: "#fff",
//     padding: 16,
//     borderRadius: 8,
//     flex: 1,
//   },

//   card: {
//     background: "#fff",
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 20,
//   },

//   filterInput: {
//     padding: 8,
//     marginBottom: 10,
//   },

//   table: {
//     width: "100%",
//   },
// };
