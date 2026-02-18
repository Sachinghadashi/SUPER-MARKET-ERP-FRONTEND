import { useEffect, useState } from "react";
import API from "../api/api";

const TodayBills = () => {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);

  useEffect(() => {
    loadTodayBills();
  }, []);

  /* ================= LOAD TODAY BILLS ================= */

  const loadTodayBills = async () => {
    try {
      const res = await API.get("/sales/my");

      const today = new Date().toDateString();

      const todayBills = res.data.filter(
        (b) =>
          new Date(b.createdAt).toDateString() === today
      );

      setBills(todayBills);
    } catch {
      alert("Failed to load today bills");
    }
  };

  /* ================= VIEW BILL ================= */

  const openBill = (bill) => {
    setSelectedBill(bill);
  };

  const closeBill = () => {
    setSelectedBill(null);
  };

  /* ================= WHATSAPP ================= */

  const sendWhatsApp = (bill) => {
    let items = bill.items
      .map(
        (i) => `${i.name} x${i.quantity} = ₹${i.total}`
      )
      .join("\n");

    const msg = `
🧾 BILL: ${bill.billNumber}

${items}

Total: ₹${bill.totalAmount}
Payment: ${bill.paymentMethod}

Date: ${new Date(bill.createdAt).toLocaleString()}
`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>📅 Today’s Bills</h3>

      {/* ================= TABLE ================= */}

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Time</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {bills.length === 0 ? (
              <tr>
                <td colSpan="4" style={styles.empty}>
                  No bills today
                </td>
              </tr>
            ) : (
              bills.map((b) => (
                <tr key={b._id}>
                  <td>
                    {new Date(
                      b.createdAt
                    ).toLocaleTimeString()}
                  </td>

                  <td>₹{b.totalAmount}</td>

                  <td>{b.paymentMethod}</td>

                  <td style={styles.actionCell}>
                    <button
                      style={styles.viewBtn}
                      onClick={() => openBill(b)}
                    >
                      👁 View
                    </button>

                    <button
                      style={styles.whatsappBtn}
                      onClick={() => sendWhatsApp(b)}
                    >
                      💬 WhatsApp
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= BILL MODAL ================= */}

      {selectedBill && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>

            <h3>🧾 Bill Receipt</h3>

            <p>
              <b>Bill No:</b>{" "}
              {selectedBill.billNumber}
            </p>

            <p>
              <b>Date:</b>{" "}
              {new Date(
                selectedBill.createdAt
              ).toLocaleString()}
            </p>

            <p>
              <b>Payment:</b>{" "}
              {selectedBill.paymentMethod}
            </p>

            <hr />

            {selectedBill.items.map((i, idx) => (
              <div key={idx} style={styles.itemRow}>
                <span>
                  {i.name} x{i.quantity}
                </span>
                <span>₹{i.total}</span>
              </div>
            ))}

            <hr />

            <div style={styles.totalRow}>
              <b>Total</b>
              <b>₹{selectedBill.totalAmount}</b>
            </div>

            <button
              style={styles.closeBtn}
              onClick={closeBill}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodayBills;

/* ================= STYLES ================= */

const styles = {
  card: {
    background: "#fff",
    padding: 16,
    borderRadius: 12,
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
  },

  title: {
    marginBottom: 14,
    fontSize: 18,
    fontWeight: 600,
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 14,
  },

  empty: {
    textAlign: "center",
    padding: 14,
    color: "#64748b",
  },

  actionCell: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
  },

  viewBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 13,
  },

  whatsappBtn: {
    background: "#22c55e",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 13,
  },

  /* ================= MODAL ================= */

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  modal: {
    background: "#fff",
    width: "90%",
    maxWidth: 400,
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },

  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 14,
    marginBottom: 4,
  },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 16,
    marginTop: 8,
  },

  closeBtn: {
    width: "100%",
    marginTop: 14,
    padding: 10,
    border: "none",
    background: "#dc2626",
    color: "#fff",
    borderRadius: 6,
    fontWeight: 600,
    cursor: "pointer",
  },
};
