import { useEffect, useState } from "react";
import API from "../api/api";

const BillHistory = () => {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);

  useEffect(() => {
    API.get("/sales/my").then((res) => setBills(res.data));
  }, []);

  /* ================= BILL TEXT ================= */
  const generateBillText = (bill) => {
    let text = "🧾 Supermarket Bill\n\n";

    bill.items.forEach((i) => {
      text += `${i.name} x${i.quantity} = ₹${i.total}\n`;
    });

    text += `\nTotal: ₹${bill.totalAmount}`;
    text += `\nPayment: ${bill.paymentMethod}`;
    text += `\nDate: ${new Date(bill.createdAt).toLocaleString()}`;

    return text;
  };

  /* ================= SHARE ================= */
  const sendWhatsApp = (bill) =>
    window.open(
      `https://wa.me/?text=${encodeURIComponent(generateBillText(bill))}`,
      "_blank"
    );

  const sendEmail = async (bill) => {
    const email = prompt("Enter customer email");
    if (!email) return;

    await API.post("/notify/email", {
      email,
      billText: generateBillText(bill),
    });

    alert("Bill sent via Email");
  };

  const sendSMS = async (bill) => {
    const phone = prompt("Enter phone with country code (eg +91...)");
    if (!phone) return;

    await API.post("/notify/sms", {
      phone,
      billText: generateBillText(bill),
    });

    alert("Bill sent via SMS");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>🧾 Bill History</h2>

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
              {bills.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    ❌ No bills found
                  </td>
                </tr>
              ) : (
                bills.map((bill) => (
                  <tr key={bill._id}>
                    <td>{new Date(bill.createdAt).toLocaleString()}</td>
                    <td>₹{bill.totalAmount}</td>
                    <td>{bill.paymentMethod}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <button
                        style={styles.viewBtn}
                        onClick={() => setSelectedBill(bill)}
                      >
                        👁 View
                      </button>{" "}
                      <button
                        style={styles.whatsappBtn}
                        onClick={() => sendWhatsApp(bill)}
                      >
                        WhatsApp
                      </button>{" "}
                      <button
                        style={styles.emailBtn}
                        onClick={() => sendEmail(bill)}
                      >
                        Email
                      </button>{" "}
                      <button
                        style={styles.smsBtn}
                        onClick={() => sendSMS(bill)}
                      >
                        SMS
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= VIEW BILL MODAL ================= */}
      {selectedBill && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={{ textAlign: "center" }}>🧾 Supermarket Bill</h3>

            <p>
              <b>Date:</b>{" "}
              {new Date(selectedBill.createdAt).toLocaleString()}
            </p>
            <p>
              <b>Payment:</b> {selectedBill.paymentMethod}
            </p>

            <hr />

            {selectedBill.items.map((i, index) => (
              <div key={index}>
                {i.name} × {i.quantity} = ₹{i.total}
              </div>
            ))}

            <hr />
            <h3>Total: ₹{selectedBill.totalAmount}</h3>

            <button
              style={styles.closeBtn}
              onClick={() => setSelectedBill(null)}
            >
              ❌ Close
            </button>
          </div>
        </div>
      )}
      {/* =================================================== */}
    </div>
  );
};

export default BillHistory;

/* ================= STYLES ================= */

const styles = {
  page: {
    padding: 10,
  },

  card: {
    background: "#ffffff",
    padding: 15,
    borderRadius: 12,
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  },

  title: {
    marginBottom: 10,
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  viewBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "4px 8px",
    cursor: "pointer",
  },

  whatsappBtn: {
    background: "#22c55e",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "4px 8px",
    cursor: "pointer",
  },

  emailBtn: {
    background: "#0ea5e9",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "4px 8px",
    cursor: "pointer",
  },

  smsBtn: {
    background: "#f59e0b",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "4px 8px",
    cursor: "pointer",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    background: "#ffffff",
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
