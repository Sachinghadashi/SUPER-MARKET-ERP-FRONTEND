import { useEffect, useState } from "react";
import API from "../api/api";

const TodayBills = () => {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);

  useEffect(() => {
    API.get("/sales/my").then((res) => {
      const today = new Date().toISOString().slice(0, 10);

      const todayBills = res.data.filter(
        (b) => b.createdAt.slice(0, 10) === today
      );

      setBills(todayBills);
    });
  }, []);

  // ================= BILL TEXT =================
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

  // ================= ACTIONS =================
  const sendWhatsApp = (bill) => {
    const url = `https://wa.me/?text=${encodeURIComponent(
      generateBillText(bill)
    )}`;
    window.open(url, "_blank");
  };

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
    const phone = prompt("Enter phone number with country code");
    if (!phone) return;

    await API.post("/notify/sms", {
      phone,
      billText: generateBillText(bill),
    });

    alert("Bill sent via SMS");
  };

  return (
    <div>
      <h3>🧾 Today’s Bills</h3>

      {bills.length === 0 ? (
        <p>No bills generated today</p>
      ) : (
        <table border="1" width="100%" cellPadding="6">
          <thead>
            <tr>
              <th>Time</th>
              <th>Total (₹)</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((b) => (
              <tr key={b._id}>
                <td>
                  {new Date(b.createdAt).toLocaleTimeString()}
                </td>
                <td>₹{b.totalAmount}</td>
                <td>{b.paymentMethod}</td>
                <td>
                  <button onClick={() => setSelectedBill(b)}>
                    👁 View
                  </button>{" "}
                  <button onClick={() => sendWhatsApp(b)}>
                    WhatsApp
                  </button>{" "}
                  <button onClick={() => sendEmail(b)}>
                    Email
                  </button>{" "}
                  <button onClick={() => sendSMS(b)}>
                    SMS
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ================= VIEW BILL MODAL ================= */}
      {selectedBill && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 20,
              width: 400,
              borderRadius: 6,
            }}
          >
            <h3 style={{ textAlign: "center" }}>
              🧾 Supermarket Bill
            </h3>

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

            <div style={{ textAlign: "right" }}>
              <button onClick={() => setSelectedBill(null)}>
                ❌ Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodayBills;
