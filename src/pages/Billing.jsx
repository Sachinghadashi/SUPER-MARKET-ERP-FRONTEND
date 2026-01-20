import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";
import API from "../api/api";

const Billing = () => {
  const [items, setItems] = useState([]);
  const [scannerOn, setScannerOn] = useState(false);

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    API.get("/products").then((res) => setProducts(res.data));
  }, []);

  /* ================= BARCODE SCANNER ================= */
  useEffect(() => {
    if (!scannerOn) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      async (decodedText) => {
        scanner.clear();
        setScannerOn(false);
        addProductByBarcode(decodedText);
      },
      () => {}
    );

    return () => scanner.clear();
  }, [scannerOn]);

  const addProductByBarcode = async (barcode) => {
    try {
      const res = await API.get(`/products/barcode/${barcode}`);
      addItemToBill(res.data);
    } catch {
      alert("Product not found");
    }
  };

  /* ================= ADD ITEM LOGIC ================= */
  const addItemToBill = (product) => {
    if (product.stock <= 0) {
      alert(`❌ ${product.name} is OUT OF STOCK`);
      return;
    }

    const existing = items.find(i => i.barcode === product.barcode);

    if (existing) {
      if (existing.quantity + 1 > product.stock) {
        alert(`❌ Only ${product.stock} items available`);
        return;
      }

      setItems(items.map(i =>
        i.barcode === product.barcode
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ));
    } else {
      setItems([
        ...items,
        {
          barcode: product.barcode,
          name: product.name,
          price: product.price,
          quantity: 1,
          stock: product.stock,
        },
      ]);
    }
  };

  const updateQty = (barcode, qty) => {
    const item = items.find(i => i.barcode === barcode);
    if (qty < 1 || qty > item.stock) {
      alert(`❌ Only ${item.stock} items available`);
      return;
    }

    setItems(items.map(i =>
      i.barcode === barcode ? { ...i, quantity: qty } : i
    ));
  };

  const removeItem = (barcode) => {
    setItems(items.filter(i => i.barcode !== barcode));
  };

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  /* ================= GENERATE BILL ================= */
  const generateBill = async () => {
    if (items.length === 0) {
      alert("No items in bill");
      return;
    }

    const confirmBill = window.confirm(
      `Items: ${items.length}\nTotal: ₹${total}\nPayment: ${paymentMethod.toUpperCase()}`
    );

    if (!confirmBill) return;

    try {
      await API.post("/sales", {
        items: items.map(i => ({
          barcode: i.barcode,
          quantity: i.quantity,
        })),
        paymentMethod,
      });

      alert("✅ Bill Generated Successfully");
      setItems([]);
      setPaymentMethod("cash");
    } catch (err) {
      alert(err.response?.data?.message || "Billing failed");
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>🧾 Cashier Billing</h2>

      {/* Scanner */}
      <div style={styles.card}>
        <button style={styles.scanBtn} onClick={() => setScannerOn(true)}>
          📷 Scan Barcode
        </button>

        {scannerOn && <div id="reader" style={styles.reader} />}
      </div>

      {/* Manual Add */}
      <div style={styles.card}>
        <h3>⌨️ Manual Add</h3>
        <input
          placeholder="Search product name or barcode"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />

        {search && (
          <div style={styles.dropdown}>
            {products
              .filter(
                p =>
                  p.name.toLowerCase().includes(search.toLowerCase()) ||
                  p.barcode.includes(search)
              )
              .slice(0, 5)
              .map(p => (
                <div
                  key={p._id}
                  style={{
                    ...styles.dropdownItem,
                    color: p.stock > 0 ? "#111" : "red",
                  }}
                  onClick={() =>
                    p.stock > 0
                      ? (addItemToBill(p), setSearch(""))
                      : alert("❌ Product out of stock")
                  }
                >
                  {p.name} — ₹{p.price} ({p.stock})
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Bill Table */}
      <div style={styles.card}>
        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {items.map(i => (
                <tr key={i.barcode}>
                  <td>{i.name}</td>
                  <td>₹{i.price}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={i.quantity}
                      onChange={e => updateQty(i.barcode, Number(e.target.value))}
                      style={styles.qtyInput}
                    />
                  </td>
                  <td>₹{i.price * i.quantity}</td>
                  <td>
                    <button style={styles.removeBtn} onClick={() => removeItem(i.barcode)}>
                      ❌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 style={styles.total}>Grand Total: ₹{total}</h3>
      </div>

      {/* Payment */}
      <div style={styles.card}>
        <h3>💳 Payment Method</h3>
        <label>
          <input
            type="radio"
            value="cash"
            checked={paymentMethod === "cash"}
            onChange={e => setPaymentMethod(e.target.value)}
          /> Cash
        </label>{" "}
        <label>
          <input
            type="radio"
            value="upi"
            checked={paymentMethod === "upi"}
            onChange={e => setPaymentMethod(e.target.value)}
          /> Online
        </label>
      </div>

      <button style={styles.generateBtn} onClick={generateBill}>
        🧾 Generate Bill
      </button>
    </div>
  );
};

export default Billing;

/* ================= STYLES ================= */

const styles = {
  page: { padding: 10 },
  title: { marginBottom: 10 },

  card: {
    background: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  },

  scanBtn: {
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
  },

  reader: { width: 280, marginTop: 10 },

  searchInput: {
    width: "100%",
    padding: 8,
    marginTop: 6,
  },

  dropdown: {
    border: "1px solid #ccc",
    borderRadius: 6,
    marginTop: 5,
  },

  dropdownItem: {
    padding: 8,
    cursor: "pointer",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  qtyInput: {
    width: 60,
  },

  removeBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "4px 8px",
    cursor: "pointer",
  },

  total: {
    textAlign: "right",
    marginTop: 10,
  },

  generateBtn: {
    width: "100%",
    padding: 12,
    background: "#22c55e",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 16,
    cursor: "pointer",
  },
};
