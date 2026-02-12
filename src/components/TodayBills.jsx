import { useEffect, useState } from "react";
import API from "../api/api";

const TodayBills = () => {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    loadTodayBills();
  }, []);

  const loadTodayBills = async () => {
    try {
      const res = await API.get("/sales/my");

      // Filter today's bills
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

  const viewBill = (bill) => {
    if (!bill.items || bill.items.length === 0) {
      alert("Bill items not found");
      return;
    }

    let itemsText = bill.items
      .map(
        (i) =>
          `${i.name} x${i.quantity} = ₹${i.total}`
      )
      .join("\n");

    alert(`
🧾 BILL RECEIPT

Bill No: ${bill.billNumber}

Items:
${itemsText}

-----------------------
Total: ₹${bill.totalAmount}
Payment: ${bill.paymentMethod}

Date: ${new Date(bill.createdAt).toLocaleString()}
    `);
  };

  /* ================= WHATSAPP ================= */

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
    <div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Time</th>
            <th>Total (₹)</th>
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
                  {new Date(b.createdAt).toLocaleTimeString()}
                </td>

                <td>₹{b.totalAmount}</td>

                <td>{b.paymentMethod}</td>

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
  );
};

export default TodayBills;

/* ================= STYLES ================= */

const styles = {
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