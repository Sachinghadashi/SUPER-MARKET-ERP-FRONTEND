import { useEffect, useRef, useState } from "react";
import API from "../api/api";
import { Html5Qrcode } from "html5-qrcode";

const Billing = () => {
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [scannerOn, setScannerOn] = useState(false);

  const scannerRef = useRef(null);
  const html5QrCode = useRef(null);

  /* ================= LOAD PRODUCTS ================= */

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data);
  };

  /* ================= BARCODE SCANNER ================= */

  useEffect(() => {
    if (scannerOn) startScanner();
    else stopScanner();

    return () => stopScanner();
  }, [scannerOn]);

  const startScanner = async () => {
    if (!scannerRef.current) return;

    if (!html5QrCode.current) {
      html5QrCode.current = new Html5Qrcode("scanner");
    }

    try {
      await html5QrCode.current.start(
        { facingMode: "environment" }, // Back camera
        {
          fps: 10,
          qrbox: 250,
        },
        (decodedText) => {
          handleScan(decodedText);
        },
        () => {}
      );
    } catch (err) {
      alert("Camera not available");
      setScannerOn(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCode.current?.isScanning) {
      await html5QrCode.current.stop();
    }
  };

  /* ================= HANDLE SCAN ================= */

  const handleScan = async (barcode) => {
    setScannerOn(false);

    try {
      const res = await API.get(`/products/barcode/${barcode}`);
      addItem(res.data);
    } catch {
      alert("Product not found");
    }
  };

  /* ================= ADD ITEM ================= */

  const addItem = (product) => {
    if (product.stock <= 0) {
      alert("Out of stock");
      return;
    }

    const exist = items.find((i) => i.barcode === product.barcode);

    if (exist) {
      if (exist.quantity + 1 > product.stock) {
        alert("Stock limit");
        return;
      }

      setItems(
        items.map((i) =>
          i.barcode === product.barcode
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setItems([
        ...items,
        {
          name: product.name,
          barcode: product.barcode,
          price: product.price,
          quantity: 1,
          stock: product.stock,
        },
      ]);
    }

    setSearch("");
  };

  /* ================= UPDATE QTY ================= */

  const changeQty = (barcode, qty) => {
    const item = items.find((i) => i.barcode === barcode);

    if (qty < 1 || qty > item.stock) {
      alert("Invalid quantity");
      return;
    }

    setItems(
      items.map((i) =>
        i.barcode === barcode ? { ...i, quantity: qty } : i
      )
    );
  };

  /* ================= REMOVE ================= */

  const removeItem = (barcode) => {
    setItems(items.filter((i) => i.barcode !== barcode));
  };

  /* ================= TOTAL ================= */

  const total = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  /* ================= GENERATE BILL ================= */

  const generateBill = async () => {
    if (!items.length) {
      alert("No items");
      return;
    }

    await API.post("/sales", {
      items: items.map((i) => ({
        barcode: i.barcode,
        quantity: i.quantity,
      })),
      paymentMethod,
    });

    alert("Bill Generated");

    setItems([]);
    loadProducts();
  };

  /* ================= UI ================= */

  return (
    <div style={styles.page}>
      <h2>🧾 Billing</h2>

      {/* SCANNER */}
      <div style={styles.card}>
        {!scannerOn ? (
          <button
            style={styles.scanBtn}
            onClick={() => setScannerOn(true)}
          >
            📷 Start Scanner
          </button>
        ) : (
          <button
            style={styles.stopBtn}
            onClick={() => setScannerOn(false)}
          >
            ❌ Stop Scanner
          </button>
        )}

        {scannerOn && (
          <div
            id="scanner"
            ref={scannerRef}
            style={styles.scannerBox}
          />
        )}
      </div>

      {/* MANUAL SEARCH */}
      <input
        style={styles.search}
        placeholder="Search product"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {search && (
        <div style={styles.dropdown}>
          {products
            .filter(
              (p) =>
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.barcode.includes(search)
            )
            .slice(0, 5)
            .map((p) => (
              <div
                key={p._id}
                style={styles.item}
                onClick={() => addItem(p)}
              >
                {p.name} | ₹{p.price}
              </div>
            ))}
        </div>
      )}

      {/* BILL TABLE */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Item</th>
            <th>₹</th>
            <th>Qty</th>
            <th>Total</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {items.map((i) => (
            <tr key={i.barcode}>
              <td>{i.name}</td>
              <td>{i.price}</td>

              <td>
                <input
                  type="number"
                  value={i.quantity}
                  min="1"
                  onChange={(e) =>
                    changeQty(i.barcode, +e.target.value)
                  }
                  style={styles.qty}
                />
              </td>

              <td>₹{i.price * i.quantity}</td>

              <td>
                <button
                  style={styles.remove}
                  onClick={() => removeItem(i.barcode)}
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Total: ₹{total}</h3>

      {/* PAYMENT */}
      <div>
        <label>
          <input
            type="radio"
            value="cash"
            checked={paymentMethod === "cash"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Cash
        </label>

        &nbsp;&nbsp;

        <label>
          <input
            type="radio"
            value="upi"
            checked={paymentMethod === "upi"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          UPI
        </label>
      </div>

      <button style={styles.billBtn} onClick={generateBill}>
        Generate Bill
      </button>
    </div>
  );
};

export default Billing;

/* ================= STYLES ================= */

const styles = {
  page: {
    padding: 16,
    background: "#f8fafc",
    minHeight: "100vh",
  },

  card: {
    background: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },

  scanBtn: {
    width: "100%",
    padding: 10,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    fontWeight: "600",
  },

  stopBtn: {
    width: "100%",
    padding: 10,
    background: "#dc2626",
    color: "#fff",
    border: "none",
  },

  scannerBox: {
    marginTop: 10,
    width: "100%",
  },

  search: {
    width: "100%",
    padding: 10,
    marginBottom: 6,
  },

  dropdown: {
    background: "#fff",
    border: "1px solid #ccc",
  },

  item: {
    padding: 8,
    cursor: "pointer",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 10,
  },

  qty: {
    width: 50,
  },

  remove: {
    background: "red",
    color: "#fff",
    border: "none",
    padding: "3px 6px",
  },

  billBtn: {
    width: "100%",
    padding: 12,
    background: "green",
    color: "#fff",
    border: "none",
    fontSize: 16,
    marginTop: 10,
  },
};
