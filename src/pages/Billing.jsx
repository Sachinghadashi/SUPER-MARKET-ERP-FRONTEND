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
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => handleScan(decodedText),
        () => {}
      );
    } catch {
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
        alert("Stock limit reached");
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

    if (!item || qty < 1 || qty > item.stock) {
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
      alert("No items in bill");
      return;
    }

    await API.post("/sales", {
      items: items.map((i) => ({
        barcode: i.barcode,
        quantity: i.quantity,
      })),
      paymentMethod,
    });

    alert("✅ Bill Generated Successfully");

    setItems([]);
    loadProducts();
  };

  /* ================= UI ================= */

  return (
    <div className="container-fluid p-3">

      <div className="card shadow rounded-4 border-0">

        {/* HEADER */}
        <div className="card-header bg-primary text-white fw-bold">
          🧾 Billing System
        </div>

        <div className="card-body">

          {/* SCANNER */}
          <div className="mb-3 text-center">

            {!scannerOn ? (
              <button
                className="btn btn-primary w-100 mb-2"
                onClick={() => setScannerOn(true)}
              >
                📷 Start Scanner
              </button>
            ) : (
              <button
                className="btn btn-danger w-100 mb-2"
                onClick={() => setScannerOn(false)}
              >
                ❌ Stop Scanner
              </button>
            )}

            {scannerOn && (
              <div
                id="scanner"
                ref={scannerRef}
                className="mx-auto mt-2"
                style={{ maxWidth: 280 }}
              />
            )}

          </div>

          {/* SEARCH */}
          <div className="mb-3 position-relative">

            <input
              className="form-control"
              placeholder="🔍 Search product name / barcode"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <div className="list-group position-absolute w-100 shadow z-3">

                {products
                  .filter(
                    (p) =>
                      p.name
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      p.barcode.includes(search)
                  )
                  .slice(0, 5)
                  .map((p) => (
                    <button
                      key={p._id}
                      className="list-group-item list-group-item-action"
                      onClick={() => addItem(p)}
                    >
                      {p.name} — ₹{p.price}
                    </button>
                  ))}
              </div>
            )}

          </div>

          {/* BILL TABLE */}
          <div className="table-responsive mb-3">

            <table className="table table-bordered table-hover text-center align-middle">

              <thead className="table-dark">
                <tr>
                  <th>Item</th>
                  <th>₹</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-muted py-3">
                      No items added
                    </td>
                  </tr>
                ) : (
                  items.map((i) => (
                    <tr key={i.barcode}>

                      <td>{i.name}</td>

                      <td>{i.price}</td>

                      <td style={{ maxWidth: 90 }}>
                        <input
                          type="number"
                          min="1"
                          className="form-control form-control-sm text-center"
                          value={i.quantity}
                          onChange={(e) =>
                            changeQty(
                              i.barcode,
                              +e.target.value
                            )
                          }
                        />
                      </td>

                      <td className="fw-bold">
                        ₹{i.price * i.quantity}
                      </td>

                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => removeItem(i.barcode)}
                        >
                          ✖
                        </button>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>

            </table>

          </div>

          {/* TOTAL */}
          <div className="d-flex justify-content-between fs-5 fw-bold mb-3">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          {/* PAYMENT */}
          <div className="mb-3">

            <label className="me-3">
              <input
                type="radio"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={(e) =>
                  setPaymentMethod(e.target.value)
                }
              />{" "}
              Cash
            </label>

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

          {/* GENERATE */}
          <button
            className="btn btn-success w-100 fw-bold"
            onClick={generateBill}
          >
            ✅ Generate Bill
          </button>

        </div>
      </div>
    </div>
  );
};

export default Billing;