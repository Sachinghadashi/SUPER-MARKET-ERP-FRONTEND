import { useEffect, useState } from "react";
import API from "../api/api";
import { useLocation } from "react-router-dom";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import jsPDF from "jspdf";
import "jspdf-autotable";

const AllBills = () => {
  const [bills, setBills] = useState([]);

  const location = useLocation();

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    const res = await API.get("/sales");
    setBills(res.data);
  };

  /* ===== Today Filter ===== */

  const params = new URLSearchParams(location.search);
  const todayOnly = params.get("today") === "true";

  const todayDate = new Date().toISOString().split("T")[0];

  const filteredBills = todayOnly
    ? bills.filter(
        (b) => b.createdAt?.split("T")[0] === todayDate
      )
    : bills;

  /* ===== Excel Download ===== */

  const downloadExcel = () => {
    const data = filteredBills.map((b) => ({
      BillNo: b.billNumber,
      Customer: b.customerName,
      Total: b.totalAmount,
      Payment: b.paymentMethod,
      Date: new Date(b.createdAt).toLocaleDateString(),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Bills");

    const file = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(new Blob([file]), "Bills.xlsx");
  };

  /* ===== PDF Download ===== */

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.text("Bills Report", 14, 15);

    const rows = filteredBills.map((b, i) => [
      i + 1,
      b.billNumber,
      b.customerName,
      b.totalAmount,
      b.paymentMethod,
      new Date(b.createdAt).toLocaleDateString(),
    ]);

    doc.autoTable({
      head: [
        ["#", "Bill No", "Customer", "Total", "Payment", "Date"],
      ],
      body: rows,
      startY: 20,
    });

    doc.save("Bills.pdf");
  };

  return (
    <div style={styles.page}>
      <h2>🧾 Bills History</h2>

      {/* Download Buttons */}
      <div style={styles.btnRow}>
        <button onClick={downloadExcel} style={styles.excelBtn}>
          📥 Download Excel File
        </button>
      </div>

      {/* Table */}
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Bill No</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredBills.map((b, i) => (
              <tr key={b._id}>
                <td>{i + 1}</td>
                <td>{b.billNumber}</td>
                <td>{b.customerName}</td>
                <td>₹{b.totalAmount}</td>
                <td>{b.paymentMethod}</td>
                <td>
                  {new Date(b.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllBills;

/* ================= STYLES ================= */

const styles = {
  page: {
    padding: 20,
    background: "#f1f5f9",
    minHeight: "100vh",
  },

  btnRow: {
    display: "flex",
    gap: 10,
    marginBottom: 14,
  },

  excelBtn: {
    background: "#16a34a",
    color: "#fff",
    padding: "8px 14px",
    border: "none",
    borderRadius: 6,
  },

  pdfBtn: {
    background: "#dc2626",
    color: "#fff",
    padding: "8px 14px",
    border: "none",
    borderRadius: 6,
  },

  card: {
    background: "#fff",
    padding: 16,
    borderRadius: 8,
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};