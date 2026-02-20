import { useEffect, useState } from "react";
import API from "../api/api";

const TodayBills = () => {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [search, setSearch] = useState("");
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
      setFilteredBills(todayBills);
    } catch {
      alert("Failed to load today bills");
    }
  };

  /* ================= SEARCH ================= */

  useEffect(() => {
    if (!search) {
      setFilteredBills(bills);
      return;
    }

    const text = search.toLowerCase();

    const filtered = bills.filter((b) => {
      return (
        b.billNumber?.toLowerCase().includes(text) ||
        b.paymentMethod?.toLowerCase().includes(text) ||
        String(b.totalAmount).includes(text) ||
        new Date(b.createdAt)
          .toLocaleTimeString()
          .toLowerCase()
          .includes(text)
      );
    });

    setFilteredBills(filtered);
  }, [search, bills]);

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

  /* ================= UI ================= */

  return (
    <div className="card shadow-sm border-0 rounded-4 p-3">

      {/* HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-2">
        <h4 className="fw-bold text-primary mb-0">
          📅 Today’s Bills
        </h4>

        {/* SEARCH */}
        <input
          type="text"
          className="form-control w-100 w-md-50"
          placeholder="🔍 Search bill..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 300 }}
        />
      </div>

      {/* TABLE */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle text-center">
          <thead className="table-dark">
            <tr>
              <th>Time</th>
              <th>Total (₹)</th>
              <th>Payment</th>
              <th width="200">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredBills.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-muted py-3">
                  No matching bills found
                </td>
              </tr>
            ) : (
              filteredBills.map((b) => (
                <tr key={b._id}>
                  <td>
                    {new Date(
                      b.createdAt
                    ).toLocaleTimeString()}
                  </td>

                  <td className="fw-bold">
                    ₹{b.totalAmount}
                  </td>

                  <td>
                    <span className="badge bg-info text-dark">
                      {b.paymentMethod}
                    </span>
                  </td>

                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2 mb-1"
                      onClick={() => openBill(b)}
                    >
                      👁 View
                    </button>

                    <button
                      className="btn btn-sm btn-success mb-1"
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

      {/* ================= MODAL ================= */}

      {selectedBill && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4">

              {/* Header */}
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  🧾 Bill Receipt
                </h5>

                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={closeBill}
                />
              </div>

              {/* Body */}
              <div className="modal-body">

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

                {/* Items */}
                {selectedBill.items.map((i, idx) => (
                  <div
                    key={idx}
                    className="d-flex justify-content-between mb-1"
                  >
                    <span>
                      {i.name} x{i.quantity}
                    </span>

                    <span>
                      ₹{i.total}
                    </span>
                  </div>
                ))}

                <hr />

                <div className="d-flex justify-content-between fs-5 fw-bold">
                  <span>Total</span>
                  <span>
                    ₹{selectedBill.totalAmount}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <button
                  className="btn btn-secondary w-100"
                  onClick={closeBill}
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TodayBills;