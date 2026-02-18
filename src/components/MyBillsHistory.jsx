import { useEffect, useState } from "react";
import API from "../api/api";
import jsPDF from "jspdf";

const MyBillsHistory = () => {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    loadMyBills();
  }, []);

  /* ================= LOAD BILLS ================= */

  const loadMyBills = async () => {
    try {
      const res = await API.get("/sales/my");
      setBills(res.data);
    } catch {
      alert("Failed to load bills");
    }
  };

  /* ================= VIEW BILL ================= */

  const viewBill = (bill) => {
    let itemsText = bill.items
      .map(
        (i) =>
          `${i.name}  x${i.quantity}  = ₹${i.total}`
      )
      .join("\n");

    alert(`
🧾 BILL RECEIPT

Bill No: ${bill.billNumber}

Items:
${itemsText}

---------------------
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

  /* ================= DOWNLOAD PDF ================= */

  const downloadPDF = (bill) => {
    const doc = new jsPDF();

    let y = 15;

    // Title
    doc.setFontSize(18);
    doc.text("Dilraj Kirana Store", 105, y, {
      align: "center",
    });

    y += 8;

    doc.setFontSize(12);
    doc.text("Bill Receipt", 105, y, {
      align: "center",
    });

    y += 10;

    // Bill Info
    doc.setFontSize(10);

    doc.text(`Bill No: ${bill.billNumber}`, 10, y);
    y += 6;

    doc.text(
      `Date: ${new Date(
        bill.createdAt
      ).toLocaleString()}`,
      10,
      y
    );
    y += 6;

    doc.text(
      `Payment: ${bill.paymentMethod}`,
      10,
      y
    );
    y += 8;

    // Table Header
    doc.setFontSize(11);
    doc.text("Item", 10, y);
    doc.text("Qty", 90, y);
    doc.text("Price", 120, y);
    doc.text("Total", 160, y);

    y += 5;
    doc.line(10, y, 200, y);
    y += 5;

    // Items
    doc.setFontSize(10);

    bill.items.forEach((item) => {
      doc.text(item.name, 10, y);
      doc.text(
        String(item.quantity),
        90,
        y
      );
      doc.text(
        `₹${item.price}`,
        120,
        y
      );
      doc.text(
        `₹${item.total}`,
        160,
        y
      );

      y += 6;

      if (y > 270) {
        doc.addPage();
        y = 15;
      }
    });

    y += 8;

    // Total
    doc.line(10, y, 200, y);
    y += 8;

    doc.setFontSize(12);
    doc.text(
      `Grand Total: ₹${bill.totalAmount}`,
      140,
      y
    );

    y += 10;

    doc.setFontSize(10);
    doc.text(
      "Thank You for Shopping!",
      105,
      y,
      { align: "center" }
    );

    // Save
    doc.save(`${bill.billNumber}.pdf`);
  };

  /* ================= UI ================= */

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>
        📜 My Bills History
      </h3>

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
                <td
                  colSpan="5"
                  style={styles.empty}
                >
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
                    {new Date(
                      b.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td style={styles.actions}>
                    <button
                      style={styles.viewBtn}
                      onClick={() =>
                        viewBill(b)
                      }
                    >
                      👁 View
                    </button>

                    <button
                      style={styles.whatsappBtn}
                      onClick={() =>
                        sendWhatsApp(b)
                      }
                    >
                      💬 WhatsApp
                    </button>

                    <button
                      style={styles.pdfBtn}
                      onClick={() =>
                        downloadPDF(b)
                      }
                    >
                      📄 PDF
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
    fontWeight: "600",
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

  actions: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
  },

  viewBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "5px 8px",
    borderRadius: 5,
    cursor: "pointer",
    fontSize: 12,
  },

  whatsappBtn: {
    background: "#22c55e",
    color: "#fff",
    border: "none",
    padding: "5px 8px",
    borderRadius: 5,
    cursor: "pointer",
    fontSize: 12,
  },

  pdfBtn: {
    background: "#f59e0b",
    color: "#fff",
    border: "none",
    padding: "5px 8px",
    borderRadius: 5,
    cursor: "pointer",
    fontSize: 12,
  },
};
