import { useEffect, useState } from "react";
import API from "../api/api";

const MyBillsHistory = () => {
  const [bills, setBills] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadMyBills();
  }, []);

  const loadMyBills = async () => {
    try {
      const res = await API.get("/sales/my");
      setBills(res.data);
    } catch {
      alert("Failed to load bills");
    }
  };

  /* ================= SEARCH FILTER ================= */

  const filteredBills = bills.filter((b) => {
    const text = search.toLowerCase();

    return (
      b.billNumber.toLowerCase().includes(text) ||
      b.paymentMethod.toLowerCase().includes(text) ||
      String(b.totalAmount).includes(text) ||
      new Date(b.createdAt)
        .toLocaleDateString()
        .includes(text)
    );
  });

  /* ================= VIEW ================= */

  const viewBill = (bill) => {
    let itemsText = bill.items
      .map(
        (i) =>
          `${i.name} x${i.quantity} = ₹${i.total}`
      )
      .join("\n");

    alert(`
🧾 BILL

Bill: ${bill.billNumber}

${itemsText}

Total: ₹${bill.totalAmount}
Payment: ${bill.paymentMethod}
Date: ${new Date(bill.createdAt).toLocaleString()}
    `);
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>📜 My Bills</h3>

      {/* 🔍 SEARCH */}
      <input
        placeholder="Search bill..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

      <div style={{ overflowX: "auto" }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Bill</th>
              <th>Total</th>
              <th>Pay</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredBills.length === 0 ? (
              <tr>
                <td colSpan="5" style={styles.empty}>
                  No bills found
                </td>
              </tr>
            ) : (
              filteredBills.map((b) => (
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
  },

  title: {
    marginBottom: 8,
  },

  search: {
    width: "100%",
    padding: 8,
    borderRadius: 6,
    border: "1px solid #cbd5e1",
    marginBottom: 10,
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
    cursor: "pointer",
  },
};
