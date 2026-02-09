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

  const openPowerBI = () => {
    window.open(POWER_BI_URL, "_blank");
  };

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
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.subtitle}>
            Logged in as <b>{user?.name}</b>
          </p>
        </div>

        <div style={styles.btnGroup}>
          <button
            onClick={() => navigate("/products")}
            style={styles.primaryBtn}
          >
            📦 Products Management
          </button>

          <button
            onClick={() => navigate("/bills")}
            style={styles.billsBtn}
          >
            🧾 View All Bills
          </button>

          <button
            onClick={() => navigate("/bills?today=true")}
            style={styles.todayBtn}
          >
            📅 View Today’s Bills
          </button>


          <button
            onClick={openPowerBI}
            style={styles.powerBiBtn}
          >
            📊 View Power BI Report
          </button>
          <button style={styles.logoutBtn} onClick={logout}>
            Logout
          </button>
        </div>
      </div>

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
          onChange={(e) => setDateFilter(e.target.value)}
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
          onChange={(e) => setMonthFilter(e.target.value)}
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
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
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




// // import { useEffect, useState } from "react";    JUNA CODE
// // import API from "../api/api";
// // import Products from "./Products";
// // import { useAuth } from "../context/AuthContext";

// // const AdminDashboard = () => {
// //   const { logout, user } = useAuth();

// //   const [summary, setSummary] = useState({
// //     totalRevenue: 0,
// //     totalBills: 0,
// //   });

// //   const [dateWise, setDateWise] = useState([]);
// //   const [monthWise, setMonthWise] = useState([]);
// //   const [yearWise, setYearWise] = useState([]);

// //   const [dateFilter, setDateFilter] = useState("");
// //   const [monthFilter, setMonthFilter] = useState("");
// //   const [yearFilter, setYearFilter] = useState("");

// //   useEffect(() => {
// //     loadReports();
// //   }, []);

// //   const loadReports = async () => {
// //     try {
// //       const totalRes = await API.get("/reports/total");
// //       const dateRes = await API.get("/reports/date");
// //       const monthRes = await API.get("/reports/month");
// //       const yearRes = await API.get("/reports/year");

// //       setSummary(totalRes.data);
// //       setDateWise(dateRes.data);
// //       setMonthWise(monthRes.data);
// //       setYearWise(yearRes.data);
// //     } catch {
// //       alert("Failed to load reports");
// //     }
// //   };

// //   const filteredDateWise = dateFilter
// //     ? dateWise.filter(d => d._id === dateFilter)
// //     : dateWise;

// //   const filteredMonthWise = monthFilter
// //     ? monthWise.filter(
// //         m =>
// //           `${m._id.year}-${String(m._id.month).padStart(2, "0")}` ===
// //           monthFilter
// //       )
// //     : monthWise;

// //   const filteredYearWise = yearFilter
// //     ? yearWise.filter(y => String(y._id.year) === yearFilter)
// //     : yearWise;

// //   return (
// //     <div style={styles.page}>
// //       {/* Top Bar */}
// //       <div style={styles.header}>
// //         <div>
// //           <h1 style={styles.title}>Admin Dashboard</h1>
// //           <p style={styles.subtitle}>
// //             Logged in as <b>{user?.name || "Admin"}</b>
// //           </p>
// //         </div>

// //         <button
// //             onClick={() => navigate("/products")}
// //             style={styles.primaryBtn}
// //           >
// //             📦 Product Management
// //           </button>

// //         <button style={styles.logoutBtn} onClick={logout}>
// //           Logout
// //         </button>
// //       </div>

// //       {/* Summary */}
// //       <div style={styles.summaryGrid}>
// //         <div style={styles.summaryCard}>
// //           <p style={styles.summaryLabel}>Total Revenue</p>
// //           <h2 style={styles.summaryValue}>₹{summary.totalRevenue}</h2>
// //         </div>

// //         <div style={styles.summaryCard}>
// //           <p style={styles.summaryLabel}>Total Bills</p>
// //           <h2 style={styles.summaryValue}>{summary.totalBills}</h2>
// //         </div>
// //       </div>

// //       {/* Date Wise */}
// //       <div style={styles.card}>
// //         <h3 style={styles.cardTitle}>Date-wise Sales</h3>
// //         <input
// //           type="date"
// //           value={dateFilter}
// //           onChange={(e) => setDateFilter(e.target.value)}
// //           style={styles.filterInput}
// //         />

// //         <table style={styles.table}>
// //           <thead>
// //             <tr>
// //               <th>Date</th>
// //               <th>Revenue (₹)</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {filteredDateWise.map((d) => (
// //               <tr key={d._id}>
// //                 <td>{d._id}</td>
// //                 <td>₹{d.totalRevenue}</td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>

// //       {/* Month Wise */}
// //       <div style={styles.card}>
// //         <h3 style={styles.cardTitle}>Month-wise Sales</h3>
// //         <input
// //           type="month"
// //           value={monthFilter}
// //           onChange={(e) => setMonthFilter(e.target.value)}
// //           style={styles.filterInput}
// //         />

// //         <table style={styles.table}>
// //           <thead>
// //             <tr>
// //               <th>Month / Year</th>
// //               <th>Revenue (₹)</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {filteredMonthWise.map((m, idx) => (
// //               <tr key={idx}>
// //                 <td>{m._id.month}/{m._id.year}</td>
// //                 <td>₹{m.totalRevenue}</td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>

// //       {/* Year Wise */}
// //       <div style={styles.card}>
// //         <h3 style={styles.cardTitle}>Year-wise Sales</h3>
// //         <input
// //           type="number"
// //           placeholder="Enter year"
// //           value={yearFilter}
// //           onChange={(e) => setYearFilter(e.target.value)}
// //           style={styles.filterInput}
// //         />

// //         <table style={styles.table}>
// //           <thead>
// //             <tr>
// //               <th>Year</th>
// //               <th>Revenue (₹)</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {filteredYearWise.map((y) => (
// //               <tr key={y._id.year}>
// //                 <td>{y._id.year}</td>
// //                 <td>₹{y.totalRevenue}</td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>

// //       {/* Product Management */}
// //       <div style={styles.card}>
// //         {/* <h2 style={styles.cardTitle}>Product Management</h2> */}
// //         <Products />
// //       </div>
// //     </div>
// //   );
// // };

// // export default AdminDashboard;


// // const styles = {
// //   page: {
// //     padding: 20,
// //     background: "#f1f5f9",
// //     minHeight: "100vh",
// //   },

// //   header: {
// //     display: "flex",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     marginBottom: 20,
// //     flexWrap: "wrap",
// //     gap: 10,
// //   },

// //   title: {
// //     fontSize: "26px",
// //     fontWeight: "700",
// //     color: "#0f172a",
// //   },

// //   subtitle: {
// //     fontSize: "13px",
// //     color: "#64748b",
// //     marginTop: 4,
// //   },

// //   logoutBtn: {
// //     padding: "8px 16px",
// //     borderRadius: 6,
// //     border: "none",
// //     background: "#dc2626",
// //     color: "#fff",
// //     fontWeight: "600",
// //     cursor: "pointer",
// //   },

// //   summaryGrid: {
// //     display: "flex",
// //     gap: 20,
// //     marginBottom: 20,
// //     flexWrap: "wrap",
// //   },

// //   summaryCard: {
// //     background: "#ffffff",
// //     padding: 20,
// //     borderRadius: 12,
// //     flex: 1,
// //     minWidth: 200,
// //     boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
// //   },

// //   summaryLabel: {
// //     fontSize: "13px",
// //     color: "#64748b",
// //   },

// //   summaryValue: {
// //     fontSize: "24px",
// //     fontWeight: "700",
// //     marginTop: 6,
// //     color: "#0f172a",
// //   },

// //   card: {
// //     background: "#ffffff",
// //     padding: 18,
// //     borderRadius: 12,
// //     marginBottom: 20,
// //     boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
// //   },

// //   cardTitle: {
// //     fontSize: "18px",
// //     fontWeight: "600",
// //     marginBottom: 10,
// //     color: "#1f2937",
// //   },

// //   filterInput: {
// //     padding: 8,
// //     borderRadius: 6,
// //     border: "1px solid #cbd5e1",
// //     marginBottom: 10,
// //   },

// //   table: {
// //     width: "100%",
// //     borderCollapse: "collapse",
// //     fontSize: "14px",
// //   },
// // };






// // import { useEffect, useState } from "react";                    REAL CODE WITHOT POWERBI
// // import API from "../api/api";
// // import { useAuth } from "../context/AuthContext";
// // import { useNavigate } from "react-router-dom";

// // const AdminDashboard = () => {
// //   const { logout, user } = useAuth();
// //   const navigate = useNavigate();

// //   const [summary, setSummary] = useState({
// //     totalRevenue: 0,
// //     totalBills: 0,
// //   });

// //   const [dateWise, setDateWise] = useState([]);
// //   const [monthWise, setMonthWise] = useState([]);
// //   const [yearWise, setYearWise] = useState([]);

// //   const [dateFilter, setDateFilter] = useState("");
// //   const [monthFilter, setMonthFilter] = useState("");
// //   const [yearFilter, setYearFilter] = useState("");

// //   useEffect(() => {
// //     loadReports();
// //   }, []);

// //   const loadReports = async () => {
// //     try {
// //       const totalRes = await API.get("/reports/total");
// //       const dateRes = await API.get("/reports/date");
// //       const monthRes = await API.get("/reports/month");
// //       const yearRes = await API.get("/reports/year");

// //       setSummary(totalRes.data);
// //       setDateWise(dateRes.data);
// //       setMonthWise(monthRes.data);
// //       setYearWise(yearRes.data);
// //     } catch {
// //       alert("Failed to load reports");
// //     }
// //   };

// //   const filteredDateWise = dateFilter
// //     ? dateWise.filter(d => d._id === dateFilter)
// //     : dateWise;

// //   const filteredMonthWise = monthFilter
// //     ? monthWise.filter(
// //         m =>
// //           `${m._id.year}-${String(m._id.month).padStart(2, "0")}` ===
// //           monthFilter
// //       )
// //     : monthWise;

// //   const filteredYearWise = yearFilter
// //     ? yearWise.filter(y => String(y._id.year) === yearFilter)
// //     : yearWise;

// //   return (
// //     <div style={styles.page}>
// //       {/* Header */}
// //       <div style={styles.header}>
// //         <div>
// //           <h1 style={styles.title}>Admin Dashboard</h1>
// //           <p style={styles.subtitle}>
// //             Logged in as <b>{user?.name || "Admin"}</b>
// //           </p>
// //         </div>

// //         <div style={{ display: "flex", gap: 10 }}>
// //           <button
// //             onClick={() => navigate("/products")}
// //             style={styles.primaryBtn}
// //           >
// //             📦 Product Management
// //           </button>

// //           <button style={styles.logoutBtn} onClick={logout}>
// //             Logout
// //           </button>
// //         </div>
// //       </div>

// //       {/* Summary */}
// //       <div style={styles.summaryGrid}>
// //         <div style={styles.summaryCard}>
// //           <p style={styles.summaryLabel}>Total Revenue</p>
// //           <h2 style={styles.summaryValue}>₹{summary.totalRevenue}</h2>
// //         </div>

// //         <div style={styles.summaryCard}>
// //           <p style={styles.summaryLabel}>Total Bills</p>
// //           <h2 style={styles.summaryValue}>{summary.totalBills}</h2>
// //         </div>
// //       </div>

// //       {/* Date Wise */}
// //       <div style={styles.card}>
// //         <h3 style={styles.cardTitle}>Date-wise Sales</h3>
// //         <input
// //           type="date"
// //           value={dateFilter}
// //           onChange={(e) => setDateFilter(e.target.value)}
// //           style={styles.filterInput}
// //         />

// //         <table style={styles.table}>
// //           <thead>
// //             <tr>
// //               <th>Date</th>
// //               <th>Revenue (₹)</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {filteredDateWise.map((d) => (
// //               <tr key={d._id}>
// //                 <td>{d._id}</td>
// //                 <td>₹{d.totalRevenue}</td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>

// //       {/* Month Wise */}
// //       <div style={styles.card}>
// //         <h3 style={styles.cardTitle}>Month-wise Sales</h3>
// //         <input
// //           type="month"
// //           value={monthFilter}
// //           onChange={(e) => setMonthFilter(e.target.value)}
// //           style={styles.filterInput}
// //         />

// //         <table style={styles.table}>
// //           <thead>
// //             <tr>
// //               <th>Month / Year</th>
// //               <th>Revenue (₹)</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {filteredMonthWise.map((m, idx) => (
// //               <tr key={idx}>
// //                 <td>{m._id.month}/{m._id.year}</td>
// //                 <td>₹{m.totalRevenue}</td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>

// //       {/* Year Wise */}
// //       <div style={styles.card}>
// //         <h3 style={styles.cardTitle}>Year-wise Sales</h3>
// //         <input
// //           type="number"
// //           placeholder="Enter year"
// //           value={yearFilter}
// //           onChange={(e) => setYearFilter(e.target.value)}
// //           style={styles.filterInput}
// //         />

// //         <table style={styles.table}>
// //           <thead>
// //             <tr>
// //               <th>Year</th>
// //               <th>Revenue (₹)</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {filteredYearWise.map((y) => (
// //               <tr key={y._id.year}>
// //                 <td>{y._id.year}</td>
// //                 <td>₹{y.totalRevenue}</td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AdminDashboard;

// // /* ================= STYLES ================= */

// // const styles = {
// //   page: {
// //     padding: 20,
// //     background: "#f1f5f9",
// //     minHeight: "100vh",
// //   },

// //   header: {
// //     display: "flex",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     marginBottom: 20,
// //     flexWrap: "wrap",
// //     gap: 10,
// //   },

// //   title: {
// //     fontSize: "26px",
// //     fontWeight: "700",
// //     color: "#0f172a",
// //   },

// //   subtitle: {
// //     fontSize: "13px",
// //     color: "#64748b",
// //     marginTop: 4,
// //   },

// //   primaryBtn: {
// //     padding: "8px 16px",
// //     borderRadius: 6,
// //     border: "none",
// //     background: "#2563eb",
// //     color: "#fff",
// //     fontWeight: "600",
// //     cursor: "pointer",
// //   },

// //   logoutBtn: {
// //     padding: "8px 16px",
// //     borderRadius: 6,
// //     border: "none",
// //     background: "#dc2626",
// //     color: "#fff",
// //     fontWeight: "600",
// //     cursor: "pointer",
// //   },

// //   summaryGrid: {
// //     display: "flex",
// //     gap: 20,
// //     marginBottom: 20,
// //     flexWrap: "wrap",
// //   },

// //   summaryCard: {
// //     background: "#ffffff",
// //     padding: 20,
// //     borderRadius: 12,
// //     flex: 1,
// //     minWidth: 200,
// //     boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
// //   },

// //   summaryLabel: {
// //     fontSize: "13px",
// //     color: "#64748b",
// //   },

// //   summaryValue: {
// //     fontSize: "24px",
// //     fontWeight: "700",
// //     marginTop: 6,
// //     color: "#0f172a",
// //   },

// //   card: {
// //     background: "#ffffff",
// //     padding: 18,
// //     borderRadius: 12,
// //     marginBottom: 20,
// //     boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
// //   },

// //   cardTitle: {
// //     fontSize: "18px",
// //     fontWeight: "600",
// //     marginBottom: 10,
// //     color: "#1f2937",
// //   },

// //   filterInput: {
// //     padding: 8,
// //     borderRadius: 6,
// //     border: "1px solid #cbd5e1",
// //     marginBottom: 10,
// //   },

// //   table: {
// //     width: "100%",
// //     borderCollapse: "collapse",
// //     fontSize: "14px",
// //   },
// // };


// import { useEffect, useState } from "react";
// import API from "../api/api";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// const POWER_BI_URL =
//   "https://app.powerbi.com/view?r=YOUR_POWER_BI_REPORT_ID";

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

//   // ✅ Open Power BI Dashboard
//   const openPowerBI = () => {
//     window.open(POWER_BI_URL, "_blank", "noopener,noreferrer");
//   };

//   return (
//     <div style={styles.page}>
//       {/* Header */}
//       <div style={styles.header}>
//         <div>
//           <h1 style={styles.title}>Admin Dashboard</h1>
//           <p style={styles.subtitle}>
//             Logged in as <b>{user?.name || "Admin"}</b>
//           </p>
//         </div>

//         <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//           <button
//             onClick={() => navigate("/products")}
//             style={styles.primaryBtn}
//           >
//             📦 Product Management
//           </button>

//           <button
//             onClick={openPowerBI}
//             style={styles.powerBiBtn}
//           >
//             📊 View Power BI Dashboard
//           </button>

//           <button style={styles.logoutBtn} onClick={logout}>
//             Logout
//           </button>
//         </div>
//       </div>

//       {/* Summary */}
//       <div style={styles.summaryGrid}>
//         <div style={styles.summaryCard}>
//           <p style={styles.summaryLabel}>Total Revenue</p>
//           <h2 style={styles.summaryValue}>₹{summary.totalRevenue}</h2>
//         </div>

//         <div style={styles.summaryCard}>
//           <p style={styles.summaryLabel}>Total Bills</p>
//           <h2 style={styles.summaryValue}>{summary.totalBills}</h2>
//         </div>
//       </div>

//       {/* Date Wise */}
//       <div style={styles.card}>
//         <h3 style={styles.cardTitle}>Date-wise Sales</h3>
//         <input
//           type="date"
//           value={dateFilter}
//           onChange={(e) => setDateFilter(e.target.value)}
//           style={styles.filterInput}
//         />

//         <table style={styles.table}>
//           <thead>
//             <tr>
//               <th>Date</th>
//               <th>Revenue (₹)</th>
//             </tr>
//           </thead>
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
//         <h3 style={styles.cardTitle}>Month-wise Sales</h3>
//         <input
//           type="month"
//           value={monthFilter}
//           onChange={(e) => setMonthFilter(e.target.value)}
//           style={styles.filterInput}
//         />

//         <table style={styles.table}>
//           <thead>
//             <tr>
//               <th>Month / Year</th>
//               <th>Revenue (₹)</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredMonthWise.map((m, idx) => (
//               <tr key={idx}>
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
//         <h3 style={styles.cardTitle}>Year-wise Sales</h3>
//         <input
//           type="number"
//           placeholder="Enter year"
//           value={yearFilter}
//           onChange={(e) => setYearFilter(e.target.value)}
//           style={styles.filterInput}
//         />

//         <table style={styles.table}>
//           <thead>
//             <tr>
//               <th>Year</th>
//               <th>Revenue (₹)</th>
//             </tr>
//           </thead>
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
//     alignItems: "center",
//     marginBottom: 20,
//     flexWrap: "wrap",
//     gap: 10,
//   },

//   title: {
//     fontSize: "26px",
//     fontWeight: "700",
//     color: "#0f172a",
//   },

//   subtitle: {
//     fontSize: "13px",
//     color: "#64748b",
//     marginTop: 4,
//   },

//   primaryBtn: {
//     padding: "8px 16px",
//     borderRadius: 6,
//     border: "none",
//     background: "#2563eb",
//     color: "#fff",
//     fontWeight: "600",
//     cursor: "pointer",
//   },

//   powerBiBtn: {
//     padding: "8px 16px",
//     borderRadius: 6,
//     border: "none",
//     background: "#f59e0b",
//     color: "#fff",
//     fontWeight: "600",
//     cursor: "pointer",
//   },

//   logoutBtn: {
//     padding: "8px 16px",
//     borderRadius: 6,
//     border: "none",
//     background: "#dc2626",
//     color: "#fff",
//     fontWeight: "600",
//     cursor: "pointer",
//   },

//   summaryGrid: {
//     display: "flex",
//     gap: 20,
//     marginBottom: 20,
//     flexWrap: "wrap",
//   },

//   summaryCard: {
//     background: "#ffffff",
//     padding: 20,
//     borderRadius: 12,
//     flex: 1,
//     minWidth: 200,
//     boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
//   },

//   summaryLabel: {
//     fontSize: "13px",
//     color: "#64748b",
//   },

//   summaryValue: {
//     fontSize: "24px",
//     fontWeight: "700",
//     marginTop: 6,
//     color: "#0f172a",
//   },

//   card: {
//     background: "#ffffff",
//     padding: 18,
//     borderRadius: 12,
//     marginBottom: 20,
//     boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
//   },

//   cardTitle: {
//     fontSize: "18px",
//     fontWeight: "600",
//     marginBottom: 10,
//     color: "#1f2937",
//   },

//   filterInput: {
//     padding: 8,
//     borderRadius: 6,
//     border: "1px solid #cbd5e1",
//     marginBottom: 10,
//   },

//   table: {
//     width: "100%",
//     borderCollapse: "collapse",
//     fontSize: "14px",
//   },
// };






