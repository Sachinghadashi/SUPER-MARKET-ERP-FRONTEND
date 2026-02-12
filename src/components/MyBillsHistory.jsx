import { useEffect, useState } from "react";
import API from "../api/api";

const MyBillsHistory = () => {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    loadMyBills();
  }, []);

  const loadMyBills = async () => {
    try {
      const res = await API.get("/sales/my");
      setBills(res.data);
    } catch (err) {
      alert("Failed to load bills");
    }
  };

  // View Bill
  const viewBill = (bill) => {
    let itemsText = bill.items
      .map(
        (i) =>
          `${i.name}  x${i.quantity}  = ₹${i.total}`
      )
      .join("\n");

    alert(`
Bill No: ${bill.billNumber}

Items:
${itemsText}

Total: ₹${bill.totalAmount}
Payment: ${bill.paymentMethod}
Date: ${new Date(bill.createdAt).toLocaleString()}
    `);
  };

  // WhatsApp
  const sendWhatsApp = (bill) => {
    const msg = `
🧾 BILL: ${bill.billNumber}
Total: ₹${bill.totalAmount}
Payment: ${bill.paymentMethod}
Date: ${new Date(bill.createdAt).toLocaleDateString()}
    `;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>📜 My Bills History</h3>

      <div style={{ overflowX: "auto" }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Bill No</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {bills.length === 0 ? (
              <tr>
                <td colSpan="5" style={styles.empty}>
                  No bills found
                </td>
              </tr>
            ) : (
              bills.map((b) => (
                <tr key={b._id}>
                  <td>{b.billNumber}</td>
                  <td>₹{b.totalAmount}</td>
                  <td>{b.paymentMethod}</td>
                  <td>
                    {new Date(b.createdAt).toLocaleDateString()}
                  </td>

                  <td>
                    <button
                      style={styles.viewBtn}
                      onClick={() => viewBill(b)}
                    >
                      View
                    </button>

                    <button
                      style={styles.whatsappBtn}
                      onClick={() => sendWhatsApp(b)}
                    >
                      WhatsApp
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyBillsHistory;

/* ================= STYLES ================= */

const styles = {
  card: {
    background: "#fff",
    padding: 16,
    borderRadius: 10,
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
  },

  title: {
    marginBottom: 12,
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 14,
  },

  empty: {
    textAlign: "center",
    padding: 12,
    color: "#64748b",
  },

  viewBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "5px 8px",
    borderRadius: 5,
    marginRight: 5,
    cursor: "pointer",
  },

  whatsappBtn: {
    background: "#22c55e",
    color: "#fff",
    border: "none",
    padding: "5px 8px",
    borderRadius: 5,
    cursor: "pointer",
  },
};
