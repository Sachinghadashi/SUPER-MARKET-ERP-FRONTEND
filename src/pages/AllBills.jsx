import { useEffect, useState } from "react";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AllBills = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bills, setBills] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);

  const [date, setDate] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const url = user?.role === "admin" ? "/sales" : "/sales/my";
        const res = await API.get(url);
        setBills(res.data);
        setFiltered(res.data);
      } catch {
        setError("Failed to load bills");
      }
    };
    fetchBills();
  }, [user]);

  /* ================= FILTER ================= */
  useEffect(() => {
    let data = bills;
    if (date) data = data.filter(b => b.createdAt.slice(0, 10) === date);
    if (month) data = data.filter(b => b.createdAt.slice(0, 7) === month);
    if (year) data = data.filter(b => b.createdAt.slice(0, 4) === year);
    setFiltered(data);
  }, [date, month, year, bills]);

  /* ================= BILL TEXT ================= */
  const generateBillText = (bill) => {
    let text = "🧾 Supermarket Bill\n\n";
    bill.items.forEach(i => {
      text += `${i.name} x${i.quantity} = ₹${i.total}\n`;
    });
    text += `\nTotal: ₹${bill.totalAmount}`;
    text += `\nPayment: ${bill.paymentMethod}`;
    text += `\nDate: ${new Date(bill.createdAt).toLocaleString()}`;
    return text;
  };

  /* ================= SHARE ================= */
  const sendWhatsApp = (bill) =>
    window.open(`https://wa.me/?text=${encodeURIComponent(generateBillText(bill))}`);

  const sendEmail = async (bill) => {
    const email = prompt("Enter customer email");
    if (!email) return;
    await API.post("/notify/email", { email, billText: generateBillText(bill) });
    alert("Bill sent via Email");
  };

  const sendSMS = async (bill) => {
    const phone = prompt("Enter phone number with country code");
    if (!phone) return;
    await API.post("/notify/sms", { phone, billText: generateBillText(bill) });
    alert("Bill sent via SMS");
  };

  return (
    <div style={darkMode ? styles.pageDark : styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h2>📜 All Bill History</h2>
        <div>
          <button style={styles.toggle} onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>{" "}
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            🔙 Back
          </button>
        </div>
      </div>

      {error && <div style={styles.errorBox}>❌ {error}</div>}

      {/* Filters */}
      <div style={darkMode ? styles.cardDark : styles.card}>
        <h3 style={styles.cardTitle}>🔍 Filters</h3>
        <div style={styles.filters}>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          <input type="month" value={month} onChange={e => setMonth(e.target.value)} />
          <input type="number" placeholder="Year" value={year} onChange={e => setYear(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div style={darkMode ? styles.cardDark : styles.card}>
        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Total (₹)</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>❌ No bills found</td>
                </tr>
              ) : (
                filtered.map(b => (
                  <tr key={b._id}>
                    <td>{new Date(b.createdAt).toLocaleString()}</td>
                    <td>₹{b.totalAmount}</td>
                    <td>{b.paymentMethod}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <button style={styles.viewBtn} onClick={() => setSelectedBill(b)}>👁 View</button>{" "}
                      <button style={styles.whatsappBtn} onClick={() => sendWhatsApp(b)}>WhatsApp</button>{" "}
                      <button style={styles.emailBtn} onClick={() => sendEmail(b)}>Email</button>{" "}
                      <button style={styles.smsBtn} onClick={() => sendSMS(b)}>SMS</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedBill && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>🧾 Supermarket Bill</h3>
            <p><b>Date:</b> {new Date(selectedBill.createdAt).toLocaleString()}</p>
            <p><b>Payment:</b> {selectedBill.paymentMethod}</p>
            <hr />
            {selectedBill.items.map((i, idx) => (
              <div key={idx}>{i.name} × {i.quantity} = ₹{i.total}</div>
            ))}
            <hr />
            <h3>Total: ₹{selectedBill.totalAmount}</h3>
            <button style={styles.closeBtn} onClick={() => setSelectedBill(null)}>
              ❌ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBills;

/* ================= STYLES ================= */

const styles = {
  page: { padding: 20, background: "#f8fafc", minHeight: "100vh" },
  pageDark: { padding: 20, background: "#020617", minHeight: "100vh", color: "#e5e7eb" },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    flexWrap: "wrap",
  },

  toggle: {
    padding: "6px 10px",
    marginRight: 8,
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
  },

  backBtn: {
    padding: "6px 12px",
    borderRadius: 6,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
  },

  errorBox: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  },

  cardDark: {
    background: "#020617",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    boxShadow: "0 8px 20px rgba(0,0,0,0.6)",
  },

  cardTitle: { marginBottom: 10 },

  filters: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  viewBtn: { background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, padding: "4px 8px" },
  whatsappBtn: { background: "#22c55e", color: "#fff", border: "none", borderRadius: 6, padding: "4px 8px" },
  emailBtn: { background: "#0ea5e9", color: "#fff", border: "none", borderRadius: 6, padding: "4px 8px" },
  smsBtn: { background: "#f59e0b", color: "#fff", border: "none", borderRadius: 6, padding: "4px 8px" },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxWidth: 400,
  },

  closeBtn: {
    marginTop: 10,
    width: "100%",
    padding: 10,
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};
