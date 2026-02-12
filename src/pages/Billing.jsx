import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import API from "../api/api";

const Billing = () => {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [scanner, setScanner] = useState(null);
  const [scanning, setScanning] = useState(false);

  /* ================= LOAD PRODUCTS ================= */

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch {
      alert("Failed to load products");
    }
  };

  /* ================= SCANNER ================= */

  const startScanner = async () => {
    try {
      const html5QrCode = new Html5Qrcode("reader");

      setScanner(html5QrCode);

      const devices = await Html5Qrcode.getCameras();

      if (!devices || devices.length === 0) {
        alert("No camera found");
        return;
      }

      // Prefer Back Camera
      const backCam =
        devices.find((d) =>
          d.label.toLowerCase().includes("back")
        ) || devices[0];

      await html5QrCode.start(
        backCam.id,
        {
          fps: 15,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
          disableFlip: false,
          focusMode: "continuous",
        },

        async (decodedText) => {
          await stopScanner();
          addProductByBarcode(decodedText);
        },

        () => {}
      );

      setScanning(true);
    } catch (err) {
      console.error(err);
      alert("Camera error");
    }
  };

  const stopScanner = async () => {
    try {
      if (scanner) {
        await scanner.stop();
        await scanner.clear();
      }
    } catch {}

    setScanning(false);
  };

  /* ================= BARCODE ================= */

  const addProductByBarcode = async (barcode) => {
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

    const existing = items.find(
      (i) => i.barcode === product.barcode
    );

    if (existing) {
      if (existing.quantity + 1 > product.stock) {
        alert("Stock limit reached");
        return;
      }

      setItems((prev) =>
        prev.map((i) =>
          i.barcode === product.barcode
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setItems((prev) => [
        ...prev,
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

  /* ================= UPDATE QTY ================= */

  const updateQty = (barcode, qty) => {
    const item = items.find((i) => i.barcode === barcode);

    if (!item) return;

    if (qty < 1 || qty > item.stock) {
      alert("Invalid quantity");
      return;
    }

    setItems((prev) =>
      prev.map((i) =>
        i.barcode === barcode
          ? { ...i, quantity: qty }
          : i
      )
    );
  };

  /* ================= REMOVE ================= */

  const removeItem = (barcode) => {
    setItems((prev) =>
      prev.filter((i) => i.barcode !== barcode)
    );
  };

  /* ================= TOTAL ================= */

  const subTotal = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const total = subTotal;

  /* ================= GENERATE BILL ================= */

  const generateBill = async () => {
    if (items.length === 0) {
      alert("No items added");
      return;
    }

    const ok = window.confirm(`
Items: ${items.length}
Total: ₹${total}
Payment: ${paymentMethod}
`);

    if (!ok) return;

    try {
      await API.post("/sales", {
        items: items.map((i) => ({
          barcode: i.barcode,
          quantity: i.quantity,
        })),
        paymentMethod,
      });

      alert("✅ Bill Generated");

      setItems([]);
      setSearch("");
      setPaymentMethod("cash");

      loadProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  /* ================= UI ================= */

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>🧾 Cashier Billing</h2>

      {/* Scanner */}
      <div style={styles.card}>
        <button
          style={styles.primaryBtn}
          onClick={startScanner}
        >
          📷 Scan Barcode
        </button>

        {scanning && (
          <>
            <div id="reader" style={styles.reader} />

            <button
              onClick={stopScanner}
              style={styles.stopBtn}
            >
              ❌ Stop Scan
            </button>
          </>
        )}
      </div>

      {/* Search */}
      <div style={styles.card}>
        <h4>Add Product</h4>

        <input
          placeholder="Search name / barcode"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />

        {search && (
          <div style={styles.dropdown}>
            {products
              .filter(
                (p) =>
                  p.name
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                  p.barcode.includes(search)
              )
              .slice(0, 6)
              .map((p) => (
                <div
                  key={p._id}
                  style={styles.dropdownItem}
                  onClick={() => {
                    addItem(p);
                    setSearch("");
                  }}
                >
                  {p.name} — ₹{p.price} (Stock: {p.stock})
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Table */}
      <div style={styles.card}>
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
                      updateQty(
                        i.barcode,
                        Number(e.target.value)
                      )
                    }
                    style={styles.qtyInput}
                  />
                </td>

                <td>₹{i.price * i.quantity}</td>

                <td>
                  <button
                    style={styles.removeBtn}
                    onClick={() =>
                      removeItem(i.barcode)
                    }
                  >
                    ✖
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={styles.totalBox}>
          <b>Grand Total</b>
          <b>₹{total}</b>
        </div>
      </div>

      {/* Payment */}
      <div style={styles.card}>
        <h4>Payment Method</h4>

        <label>
          <input
            type="radio"
            value="cash"
            checked={paymentMethod === "cash"}
            onChange={(e) =>
              setPaymentMethod(e.target.value)
            }
          />{" "}
          Cash
        </label>{" "}
        &nbsp;&nbsp;

        <label>
          <input
            type="radio"
            value="upi"
            checked={paymentMethod === "upi"}
            onChange={(e) =>
              setPaymentMethod(e.target.value)
            }
          />{" "}
          UPI
        </label>
      </div>

      {/* Generate */}
      <button
        style={styles.generateBtn}
        onClick={generateBill}
      >
        ✅ Generate Bill
      </button>
    </div>
  );
};

export default Billing;

/* ================= STYLES ================= */

const styles = {
  page: {
    padding: 14,
    background: "#f8fafc",
    minHeight: "100vh",
  },

  heading: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 12,
  },

  card: {
    background: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },

  primaryBtn: {
    padding: 10,
    width: "100%",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontWeight: 600,
  },

  stopBtn: {
    marginTop: 8,
    width: "100%",
    background: "#dc2626",
    color: "#fff",
    padding: 8,
    border: "none",
    borderRadius: 6,
    fontWeight: 600,
  },

  reader: {
    width: "100%",
    maxWidth: 280,
    margin: "10px auto",
  },

  searchInput: {
    width: "100%",
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
  },

  dropdown: {
    border: "1px solid #ccc",
    marginTop: 5,
  },

  dropdownItem: {
    padding: 8,
    cursor: "pointer",
    borderBottom: "1px solid #eee",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  qtyInput: {
    width: 50,
  },

  removeBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "4px 6px",
    borderRadius: 4,
  },

  totalBox: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 10,
    fontSize: 18,
  },

  generateBtn: {
    width: "100%",
    padding: 14,
    background: "#22c55e",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 700,
  },
};
