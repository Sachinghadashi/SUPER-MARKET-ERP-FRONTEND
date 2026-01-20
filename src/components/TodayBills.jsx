import { useEffect, useState } from "react";
import API from "../api/api";

const TodayBills = () => {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    API.get("/sales/my").then((res) => {
      const today = new Date().toISOString().slice(0, 10);

      const todayBills = res.data.filter(
        (b) => b.createdAt.slice(0, 10) === today
      );

      setBills(todayBills);
    });
  }, []);

  return (
    <div>
      <h3>🧾 Today’s Bills</h3>

      {bills.length === 0 ? (
        <p>No bills today</p>
      ) : (
        <table border="1" cellPadding="6" width="100%">
          <thead>
            <tr>
              <th>Time</th>
              <th>Total</th>
              <th>Payment</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TodayBills;
