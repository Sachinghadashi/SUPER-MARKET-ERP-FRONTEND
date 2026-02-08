import { useEffect, useState } from "react";
import API from "../api/api";
import { useLocation } from "react-router-dom";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import jsPDF from "jspdf";
import "jspdf-autotable";

const AllBills = () => {
  const [bills, setBills] = useState([]);

  const location = useLocation();

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    const res = await API.get("/sales");
    setBills(res.data);
  };

  /* ===== Today Filter ===== */

  const params = new URLSearchParams(location.search);
  const todayOnly = params.get("today") === "true";

  const todayDate = new Date().toISOString().split("T")[0];

  const filteredBills = todayOnly
    ? bills.filter(
        (b) => b.createdAt?.split("T")[0] === todayDate
      )
    : bills;

  /* ===== Excel Download ===== */

  const downloadExcel = () => {
    const data = filteredBills.map((b) => ({
      BillNo: b.billNumber,
      Customer: b.customerName,
      Total: b.totalAmount,
      Payment: b.paymentMethod,
      Date: new Date(b.createdAt).toLocaleDateString(),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Bills");

    const file = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(new Blob([file]), "Bills.xlsx");
  };

  /* ===== PDF Download ===== */

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.text("Bills Report", 14, 15);

    const rows = filteredBills.map((b, i) => [
      i + 1,
      b.billNumber,
      b.customerName,
      b.totalAmount,
      b.paymentMethod,
      new Date(b.createdAt).toLocaleDateString(),
    ]);

    doc.autoTable({
      head: [
        ["#", "Bill No", "Customer", "Total", "Payment", "Date"],
      ],
      body: rows,
      startY: 20,
    });

    doc.save("Bills.pdf");
  };

  return (
    <div style={styles.page}>
      <h2>🧾 Bills History</h2>

      {/* Download Buttons */}
      <div style={styles.btnRow}>
        <button onClick={downloadExcel} style={styles.excelBtn}>
          📥 Excel
        </button>

        <button onClick={downloadPDF} style={styles.pdfBtn}>
          📄 PDF
        </button>
      </div>

      {/* Table */}
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Bill No</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredBills.map((b, i) => (
              <tr key={b._id}>
                <td>{i + 1}</td>
                <td>{b.billNumber}</td>
                <td>{b.customerName}</td>
                <td>₹{b.totalAmount}</td>
                <td>{b.paymentMethod}</td>
                <td>
                  {new Date(b.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllBills;

/* ================= STYLES ================= */

const styles = {
  page: {
    padding: 20,
    background: "#f1f5f9",
    minHeight: "100vh",
  },

  btnRow: {
    display: "flex",
    gap: 10,
    marginBottom: 14,
  },

  excelBtn: {
    background: "#16a34a",
    color: "#fff",
    padding: "8px 14px",
    border: "none",
    borderRadius: 6,
  },

  pdfBtn: {
    background: "#dc2626",
    color: "#fff",
    padding: "8px 14px",
    border: "none",
    borderRadius: 6,
  },

  card: {
    background: "#fff",
    padding: 16,
    borderRadius: 8,
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};


// import { useEffect, useState } from "react";
// import API from "../api/api";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// const AllBills = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [bills, setBills] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [selectedBill, setSelectedBill] = useState(null);

//   const [date, setDate] = useState("");
//   const [month, setMonth] = useState("");
//   const [year, setYear] = useState("");
//   const [error, setError] = useState("");
//   const [darkMode, setDarkMode] = useState(false);

//   /* ================= FETCH ================= */
//   useEffect(() => {
//     const fetchBills = async () => {
//       try {
//         const url = user?.role === "admin" ? "/sales" : "/sales/my";
//         const res = await API.get(url);
//         setBills(res.data);
//         setFiltered(res.data);
//       } catch {
//         setError("Failed to load bills");
//       }
//     };
//     fetchBills();
//   }, [user]);

//   /* ================= FILTER ================= */
//   useEffect(() => {
//     let data = bills;
//     if (date) data = data.filter(b => b.createdAt.slice(0, 10) === date);
//     if (month) data = data.filter(b => b.createdAt.slice(0, 7) === month);
//     if (year) data = data.filter(b => b.createdAt.slice(0, 4) === year);
//     setFiltered(data);
//   }, [date, month, year, bills]);

//   /* ================= BILL TEXT ================= */
//   const generateBillText = (bill) => {
//     let text = "Supermarket Bill\n\n";
//     bill.items.forEach(i => {
//       text += `${i.name} x${i.quantity} = ₹${i.total}\n`;
//     });
//     text += `\nTotal: ₹${bill.totalAmount}`;
//     text += `\nPayment: ${bill.paymentMethod}`;
//     text += `\nDate: ${new Date(bill.createdAt).toLocaleString()}`;
//     return text;
//   };

//   /* ================= SHARE ================= */
//   const sendWhatsApp = (bill) =>
//     window.open(`https://wa.me/?text=${encodeURIComponent(generateBillText(bill))}`);

//   const sendEmail = async (bill) => {
//     const email = prompt("Enter customer email");
//     if (!email) return;
//     await API.post("/notify/email", { email, billText: generateBillText(bill) });
//     alert("Bill sent via Email");
//   };

//   const sendSMS = async (bill) => {
//     const phone = prompt("Enter phone number with country code");
//     if (!phone) return;
//     await API.post("/notify/sms", { phone, billText: generateBillText(bill) });
//     alert("Bill sent via SMS");
//   };

//   return (
//     <div style={darkMode ? styles.pageDark : styles.page}>
//       {/* Header */}
//       <div style={styles.header}>
//         <h2 style={styles.heading}>Billing History</h2>
//         <div>
//           <button style={styles.toggle} onClick={() => setDarkMode(!darkMode)}>
//             {darkMode ? "Light" : "Dark"}
//           </button>
//           <button style={styles.backBtn} onClick={() => navigate(-1)}>
//             Back
//           </button>
//         </div>
//       </div>

//       {error && <div style={styles.errorBox}>{error}</div>}

//       {/* Filters */}
//       <div style={darkMode ? styles.cardDark : styles.card}>
//         <h4 style={styles.cardTitle}>Filters</h4>
//         <div style={styles.filters}>
//           <input type="date" value={date} onChange={e => setDate(e.target.value)} />
//           <input type="month" value={month} onChange={e => setMonth(e.target.value)} />
//           <input
//             type="number"
//             placeholder="Year"
//             value={year}
//             onChange={e => setYear(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Table */}
//       <div style={darkMode ? styles.cardDark : styles.card}>
//         <div style={{ overflowX: "auto" }}>
//           <table style={styles.table}>
//             <thead>
//               <tr>
//                 <th>Date & Time</th>
//                 <th>Total (₹)</th>
//                 <th>Payment</th>
//                 <th style={{ textAlign: "center" }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.length === 0 ? (
//                 <tr>
//                   <td colSpan="4" style={styles.empty}>No bills found</td>
//                 </tr>
//               ) : (
//                 filtered.map(b => (
//                   <tr key={b._id}>
//                     <td>{new Date(b.createdAt).toLocaleString()}</td>
//                     <td>₹{b.totalAmount}</td>
//                     <td>{b.paymentMethod}</td>
//                     <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
//                       <button style={styles.viewBtn} onClick={() => setSelectedBill(b)}>
//                         View
//                       </button>
//                       <button style={styles.whatsappBtn} onClick={() => sendWhatsApp(b)}>
//                         WhatsApp
//                       </button>
//                       <button style={styles.emailBtn} onClick={() => sendEmail(b)}>
//                         Email
//                       </button>
//                       <button style={styles.smsBtn} onClick={() => sendSMS(b)}>
//                         SMS
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Modal */}
//       {selectedBill && (
//         <div style={styles.overlay}>
//           <div style={styles.modal}>
//             <h3>Invoice</h3>
//             <p><b>Date:</b> {new Date(selectedBill.createdAt).toLocaleString()}</p>
//             <p><b>Payment:</b> {selectedBill.paymentMethod}</p>
//             <hr />
//             {selectedBill.items.map((i, idx) => (
//               <div key={idx}>
//                 {i.name} × {i.quantity} = ₹{i.total}
//               </div>
//             ))}
//             <hr />
//             <h3>Total: ₹{selectedBill.totalAmount}</h3>
//             <button style={styles.closeBtn} onClick={() => setSelectedBill(null)}>
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllBills;


// const styles = {
//   page: { padding: 20, background: "#f8fafc", minHeight: "100vh" },
//   pageDark: { padding: 20, background: "#020617", minHeight: "100vh", color: "#e5e7eb" },

//   header: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//     flexWrap: "wrap",
//   },

//   heading: {
//     fontSize: "22px",
//     fontWeight: "700",
//     color: "#0f172a",
//   },

//   toggle: {
//     padding: "6px 10px",
//     marginRight: 8,
//     borderRadius: 6,
//     border: "1px solid #cbd5e1",
//     background: "#fff",
//     cursor: "pointer",
//   },

//   backBtn: {
//     padding: "6px 12px",
//     borderRadius: 6,
//     border: "none",
//     background: "#2563eb",
//     color: "#fff",
//     cursor: "pointer",
//   },

//   errorBox: {
//     background: "#fee2e2",
//     color: "#b91c1c",
//     padding: 10,
//     borderRadius: 6,
//     marginBottom: 10,
//   },

//   card: {
//     background: "#fff",
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 16,
//     boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
//   },

//   cardDark: {
//     background: "#020617",
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 16,
//     boxShadow: "0 6px 18px rgba(0,0,0,0.6)",
//   },

//   cardTitle: { marginBottom: 10 },

//   filters: {
//     display: "flex",
//     gap: 10,
//     flexWrap: "wrap",
//   },

//   table: {
//     width: "100%",
//     borderCollapse: "collapse",
//     fontSize: "14px",
//   },

//   empty: {
//     textAlign: "center",
//     padding: 16,
//     color: "#64748b",
//   },

//   viewBtn: { background: "#2563eb", color: "#fff", border: "none", borderRadius: 5, padding: "5px 8px", marginRight: 4 },
//   whatsappBtn: { background: "#22c55e", color: "#fff", border: "none", borderRadius: 5, padding: "5px 8px", marginRight: 4 },
//   emailBtn: { background: "#0ea5e9", color: "#fff", border: "none", borderRadius: 5, padding: "5px 8px", marginRight: 4 },
//   smsBtn: { background: "#f59e0b", color: "#fff", border: "none", borderRadius: 5, padding: "5px 8px" },

//   overlay: {
//     position: "fixed",
//     inset: 0,
//     background: "rgba(0,0,0,0.5)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   modal: {
//     background: "#fff",
//     padding: 20,
//     borderRadius: 10,
//     width: "90%",
//     maxWidth: 400,
//   },

//   closeBtn: {
//     marginTop: 12,
//     width: "100%",
//     padding: 10,
//     background: "#ef4444",
//     color: "#fff",
//     border: "none",
//     borderRadius: 6,
//     cursor: "pointer",
//   },
// };
