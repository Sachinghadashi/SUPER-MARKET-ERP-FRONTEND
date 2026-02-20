import { useEffect, useState } from "react";
import API from "../api/api";

const AllBills = () => {
  const [bills, setBills] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedBill, setSelectedBill] = useState(null);

  useEffect(() => {
    loadBills();
  }, []);

  /* ================= LOAD ALL BILLS ================= */

  const loadBills = async () => {
    try {
      const res = await API.get("/sales");
      setBills(res.data);
    } catch {
      alert("Failed to load bills");
    }
  };

  /* ================= FILTER ================= */

  const filteredBills = bills.filter(
    (b) =>
      b.billNumber.toLowerCase().includes(search.toLowerCase()) ||
      (b.customerName || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  /* ================= VIEW ================= */

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
    <div className="container-fluid bg-light min-vh-100 p-3">

      {/* ================= HEADER ================= */}

      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="card-body">

          <h3 className="fw-bold text-primary mb-3">
            🧾 All Bills History
          </h3>

          {/* Search */}
          <input
            type="text"
            placeholder="🔍 Search by Bill No / Customer"
            className="form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>
      </div>

      {/* ================= TABLE ================= */}

      <div className="card shadow-sm border-0 rounded-4">

        <div className="card-body p-0">

          <div className="table-responsive">

            <table className="table table-bordered table-hover text-center mb-0">

              <thead className="table-dark">
                <tr>
                  <th>Bill No</th>
                  <th>Customer</th>
                  <th>Total (₹)</th>
                  <th>Payment</th>
                  <th>Date</th>
                  <th width="220">Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredBills.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-muted py-4"
                    >
                      No bills found
                    </td>
                  </tr>
                ) : (
                  filteredBills.map((b) => (
                    <tr key={b._id}>

                      <td>{b.billNumber}</td>

                      <td>
                        {b.customerName || "Walk-in"}
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
                        {new Date(
                          b.createdAt
                        ).toLocaleDateString()}
                      </td>

                      <td>

                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => openBill(b)}
                        >
                          👁 View
                        </button>

                        <button
                          className="btn btn-sm btn-success"
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
        </div>
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
                  <b>Customer:</b>{" "}
                  {selectedBill.customerName ||
                    "Walk-in"}
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

export default AllBills;