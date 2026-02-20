import { useEffect, useState } from "react";
import API from "../api/api";
import jsPDF from "jspdf";

const MyBillsHistory = () => {
  const [bills, setBills] = useState([]);

  // Filters
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

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

  /* ================= FILTER LOGIC ================= */

  const filteredBills = bills.filter((b) => {
    const matchesSearch =
      b.billNumber
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      b.paymentMethod
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesDate = dateFilter
      ? new Date(b.createdAt)
          .toISOString()
          .slice(0, 10) === dateFilter
      : true;

    return matchesSearch && matchesDate;
  });

  /* ================= VIEW BILL ================= */

  const viewBill = (bill) => {
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

----------------------
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

    doc.setFontSize(18);
    doc.text("Dilraj Kirana Store", 105, y, {
      align: "center",
    });

    y += 10;

    doc.setFontSize(11);
    doc.text(`Bill: ${bill.billNumber}`, 10, y);
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

    y += 10;

    doc.text("Item", 10, y);
    doc.text("Qty", 90, y);
    doc.text("Price", 120, y);
    doc.text("Total", 160, y);

    y += 5;
    doc.line(10, y, 200, y);
    y += 5;

    bill.items.forEach((i) => {
      doc.text(i.name, 10, y);
      doc.text(String(i.quantity), 90, y);
      doc.text(`₹${i.price}`, 120, y);
      doc.text(`₹${i.total}`, 160, y);

      y += 6;
    });

    y += 10;

    doc.text(
      `Grand Total: ₹${bill.totalAmount}`,
      140,
      y
    );

    doc.save(`${bill.billNumber}.pdf`);
  };

  /* ================= UI ================= */

  return (
    <div className="card shadow-sm border-0 rounded-4">
      <div className="card-body">

        {/* TITLE */}
        <h4 className="mb-3 fw-bold text-center">
          📜 My Bills History
        </h4>

        {/* FILTERS */}
        <div className="row g-2 mb-3">

          {/* Search */}
          <div className="col-md-6 col-12">
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Search Bill No / Payment"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          {/* Date */}
          <div className="col-md-4 col-12">
            <input
              type="date"
              className="form-control"
              value={dateFilter}
              onChange={(e) =>
                setDateFilter(e.target.value)
              }
            />
          </div>

          {/* Clear */}
          <div className="col-md-2 col-12">
            <button
              className="btn btn-secondary w-100"
              onClick={() => {
                setSearch("");
                setDateFilter("");
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle text-center">

            <thead className="table-dark">
              <tr>
                <th>Bill No</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Date</th>
                <th width="220">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-muted py-3">
                    No bills found
                  </td>
                </tr>
              ) : (
                filteredBills.map((b) => (
                  <tr key={b._id}>
                    <td>{b.billNumber}</td>

                    <td className="fw-semibold">
                      ₹{b.totalAmount}
                    </td>

                    <td className="text-capitalize">
                      {b.paymentMethod}
                    </td>

                    <td>
                      {new Date(
                        b.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      <div className="d-flex flex-wrap justify-content-center gap-1">

                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => viewBill(b)}
                        >
                          👁 View
                        </button>

                        <button
                          className="btn btn-sm btn-success"
                          onClick={() =>
                            sendWhatsApp(b)
                          }
                        >
                          💬 WhatsApp
                        </button>

                        <button
                          className="btn btn-sm btn-warning text-white"
                          onClick={() =>
                            downloadPDF(b)
                          }
                        >
                          📄 PDF
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default MyBillsHistory;