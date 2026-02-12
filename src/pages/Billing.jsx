import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import API from "../api/api";

const Billing = () => {
  const [items, setItems] = useState([]);
  const [scannerOn, setScannerOn] = useState(false);

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const scannerRef = useRef(null);

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

  useEffect(() => {
    if (scannerOn) startScanner();
    else stopScanner();

    return () => stopScanner();
  }, [scannerOn]);

  const startScanner = async () => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode("reader");
    }

    try {
      await scannerRef.current.start(
        { facingMode: "environment" }, // Back camera
        {
          fps: 10,
          qrbox: 250,
        },
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        () => {}
      );
    } catch (err) {
      alert("Camera error. Please allow permission.");
      console.error(err);
    }
  };

  const stopScanner = async () => {
    try {
      if (scannerRef.current?.isScanning) {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      }
    } catch {}
  };

  const handleScanSuccess = async (barcode) => {
    setScannerOn(false);

    try {
      const res = await API.get(`/products/barcode/${barcode}`);
      addItemToBill(res.data);
    } catch {
      alert("Product not found");
    }
  };

  /* ================= ADD ITEM ================= */

  const addItemToBill = (product) => {
    if (product.stock <= 0) {
      alert("Out of stock");
      return;
    }

    const existing = items.find((i) => i.barcode === product.barcode);

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

  /* ================= QTY ================= */

  const updateQty = (barcode, qty) => {
    const item = items.find((i) => i.barcode === barcode);

    if (!item) return;

    if (qty < 1 || qty > item.stock) {
      alert(`Only ${item.stock} available`);
      return;
    }

    setItems((prev) =>
      prev.map((i) =>
        i.barcode === barcode ? { ...i, quantity: qty } : i
      )
    );
  };

  /* ================= REMOVE ================= */

  const removeItem = (barcode) => {
    setItems((prev) => prev.filter((i) => i.barcode !== barcode));
  };

  /* ================= TOTAL ================= */

  const total = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  /* ================= BILL ================= */

  const generateBill = async () => {
    if (items.length === 0) return alert("No items");

    try {
      await API.post("/sales", {
        items: items.map((i) => ({
          barcode: i.barcode,
          quantity: i.quantity,
        })),
        paymentMethod,
      });

      alert("Bill Generated");

      setItems([]);
      setPaymentMethod("cash");
      setSearch("");

      loadProducts();
    } catch (err) {
      alert("Billing failed");
    }
  };

  /* ================= UI ================= */

  return (
    <div style={styles.page}>
      <h2>🧾 Cashier Billing</h2>

      {/* Scanner */}
      <div style={styles.card}>
        <button
          style={styles.primaryBtn}
          onClick={() => setScannerOn(!scannerOn)}
        >
          {scannerOn ? "Stop Scanner" : "Scan Barcode"}
        </button>

        {scannerOn && <div id="reader" style={styles.reader}></div>}
      </div>

      {/* Search */}
      <div style={styles.card}>
        <input
          placeholder="Search product"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
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
                  style={styles.dropdownItem}
                  onClick={() => {
                    addItemToBill(p);
                    setSearch("");
                  }}
                >
                  {p.name} - ₹{p.price}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Table */}
      <div style={styles.card}>
        <table width="100%">
          <thead>
            <tr>
              <th>Item</th>
              <th>₹</th>
              <th>Qty</th>
              <th>Total</th>
              <th></th>
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
                      updateQty(i.barcode, Number(e.target.value))
                    }
                    style={{ width: 50 }}
                  />
                </td>

                <td>₹{i.price * i.quantity}</td>

                <td>
                  <button
                    style={styles.removeBtn}
                    onClick={() => removeItem(i.barcode)}
                  >
                    ✖
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Total: ₹{total}</h3>
      </div>

      {/* Payment */}
      <div style={styles.card}>
        <label>
          <input
            type="radio"
            value="cash"
            checked={paymentMethod === "cash"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />{" "}
          Cash
        </label>{" "}
        &nbsp;

        <label>
          <input
            type="radio"
            value="upi"
            checked={paymentMethod === "upi"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />{" "}
          UPI
        </label>
      </div>

      <button style={styles.generateBtn} onClick={generateBill}>
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
    padding: 14,
    borderRadius: 8,
    marginBottom: 14,
  },

  primaryBtn: {
    width: "100%",
    padding: 12,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontWeight: "600",
  },

  reader: {
    width: "100%",
    maxWidth: 300,
    margin: "10px auto",
  },

  search: {
    width: "100%",
    padding: 10,
  },

  dropdown: {
    border: "1px solid #ddd",
    marginTop: 5,
  },

  dropdownItem: {
    padding: 8,
    cursor: "pointer",
  },

  removeBtn: {
    background: "red",
    color: "#fff",
    border: "none",
    padding: "4px 6px",
    borderRadius: 4,
  },

  generateBtn: {
    width: "100%",
    padding: 14,
    background: "#22c55e",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontWeight: "700",
  },
};




// import { Html5QrcodeScanner } from "html5-qrcode";
// import { useEffect, useRef, useState } from "react";
// import API from "../api/api";

// const Billing = () => {
//   const [items, setItems] = useState([]);
//   const [scannerOn, setScannerOn] = useState(false);

//   const [products, setProducts] = useState([]);
//   const [search, setSearch] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("cash");

//   const scannerRef = useRef(null);

//   /* ================= LOAD PRODUCTS ================= */

//   useEffect(() => {
//     loadProducts();
//   }, []);

//   const loadProducts = async () => {
//     try {
//       const res = await API.get("/products");
//       setProducts(res.data);
//     } catch {
//       alert("Failed to load products");
//     }
//   };

//   /* ================= SCANNER ================= */

//   useEffect(() => {
//     if (!scannerOn) return;

//     // Prevent multiple scanners
//     if (scannerRef.current) return;

//     const scanner = new Html5QrcodeScanner(
//       "reader",
//       { fps: 10, qrbox: 220 },
//       false
//     );

//     scannerRef.current = scanner;

//     scanner.render(
//       async (decodedText) => {
//         try {
//           await scanner.clear();
//         } catch {}

//         scannerRef.current = null;
//         setScannerOn(false);

//         addProductByBarcode(decodedText);
//       },
//       () => {}
//     );

//     return () => {
//       if (scannerRef.current) {
//         scannerRef.current
//           .clear()
//           .catch(() => {})
//           .finally(() => {
//             scannerRef.current = null;
//           });
//       }
//     };
//   }, [scannerOn]);

//   /* ================= BARCODE ================= */

//   const addProductByBarcode = async (barcode) => {
//     try {
//       const res = await API.get(`/products/barcode/${barcode}`);
//       addItem(res.data);
//     } catch {
//       alert("Product not found");
//     }
//   };

//   /* ================= ADD ITEM ================= */

//   const addItem = (product) => {
//     if (product.stock <= 0) {
//       alert(`${product.name} is out of stock`);
//       return;
//     }

//     const existing = items.find(
//       (i) => i.barcode === product.barcode
//     );

//     if (existing) {
//       if (existing.quantity + 1 > product.stock) {
//         alert(`Only ${product.stock} items available`);
//         return;
//       }

//       setItems((prev) =>
//         prev.map((i) =>
//           i.barcode === product.barcode
//             ? { ...i, quantity: i.quantity + 1 }
//             : i
//         )
//       );
//     } else {
//       setItems((prev) => [
//         ...prev,
//         {
//           barcode: product.barcode,
//           name: product.name,
//           price: product.price,
//           quantity: 1,
//           stock: product.stock,
//         },
//       ]);
//     }
//   };

//   /* ================= UPDATE QTY ================= */

//   const updateQty = (barcode, qty) => {
//     const item = items.find((i) => i.barcode === barcode);

//     if (!item) return;

//     if (qty < 1 || qty > item.stock) {
//       alert(`Only ${item.stock} items available`);
//       return;
//     }

//     setItems((prev) =>
//       prev.map((i) =>
//         i.barcode === barcode
//           ? { ...i, quantity: qty }
//           : i
//       )
//     );
//   };

//   /* ================= REMOVE ================= */

//   const removeItem = (barcode) => {
//     setItems((prev) =>
//       prev.filter((i) => i.barcode !== barcode)
//     );
//   };

//   /* ================= TOTAL ================= */

//   const total = items.reduce(
//     (sum, i) => sum + i.price * i.quantity,
//     0
//   );

//   /* ================= GENERATE ================= */

//   const generateBill = async () => {
//     if (items.length === 0) {
//       alert("No items in bill");
//       return;
//     }

//     const confirm = window.confirm(`
// Items: ${items.length}
// Total: ₹${total}
// Payment: ${paymentMethod.toUpperCase()}
//     `);

//     if (!confirm) return;

//     try {
//       await API.post("/sales", {
//         items: items.map((i) => ({
//           barcode: i.barcode,
//           quantity: i.quantity,
//         })),
//         paymentMethod,
//       });

//       alert("✅ Bill Generated");

//       setItems([]);
//       setPaymentMethod("cash");
//       setSearch("");

//       loadProducts();
//     } catch (err) {
//       alert(err.response?.data?.message || "Billing failed");
//     }
//   };

//   /* ================= UI ================= */

//   return (
//     <div style={styles.page}>
//       <h2 style={styles.heading}>🧾 Cashier Billing</h2>

//       {/* Scanner */}
//       <div style={styles.card}>
//         <button
//           style={styles.primaryBtn}
//           onClick={() => {
//             if (!scannerOn) setScannerOn(true);
//           }}
//         >
//           📷 Scan Barcode
//         </button>

//         {scannerOn && (
//           <div id="reader" style={styles.reader} />
//         )}
//       </div>

//       {/* Manual Add */}
//       <div style={styles.card}>
//         <h4 style={styles.sectionTitle}>Add Product</h4>

//         <input
//           placeholder="Search name / barcode"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           style={styles.searchInput}
//         />

//         {search && (
//           <div style={styles.dropdown}>
//             {products
//               .filter(
//                 (p) =>
//                   p.name
//                     .toLowerCase()
//                     .includes(search.toLowerCase()) ||
//                   p.barcode.includes(search)
//               )
//               .slice(0, 6)
//               .map((p) => (
//                 <div
//                   key={p._id}
//                   style={{
//                     ...styles.dropdownItem,
//                     color:
//                       p.stock > 0
//                         ? "#0f172a"
//                         : "#dc2626",
//                   }}
//                   onClick={() =>
//                     p.stock > 0
//                       ? (addItem(p), setSearch(""))
//                       : alert("Out of stock")
//                   }
//                 >
//                   {p.name} — ₹{p.price} (Stock:
//                   {p.stock})
//                 </div>
//               ))}
//           </div>
//         )}
//       </div>

//       {/* Bill */}
//       <div style={styles.card}>
//         <table style={styles.table}>
//           <thead>
//             <tr>
//               <th>Item</th>
//               <th>₹</th>
//               <th>Qty</th>
//               <th>Total</th>
//               <th />
//             </tr>
//           </thead>

//           <tbody>
//             {items.map((i) => (
//               <tr key={i.barcode}>
//                 <td>{i.name}</td>
//                 <td>{i.price}</td>

//                 <td>
//                   <input
//                     type="number"
//                     min="1"
//                     value={i.quantity}
//                     onChange={(e) =>
//                       updateQty(
//                         i.barcode,
//                         Number(e.target.value)
//                       )
//                     }
//                     style={styles.qtyInput}
//                   />
//                 </td>

//                 <td>₹{i.price * i.quantity}</td>

//                 <td>
//                   <button
//                     style={styles.removeBtn}
//                     onClick={() =>
//                       removeItem(i.barcode)
//                     }
//                   >
//                     ✖
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         <div style={styles.totalBoxMain}>
//           <span>Grand Total</span>
//           <span>₹{total}</span>
//         </div>
//       </div>

//       {/* Payment */}
//       <div style={styles.card}>
//         <h4 style={styles.sectionTitle}>
//           Payment Method
//         </h4>

//         <label>
//           <input
//             type="radio"
//             value="cash"
//             checked={paymentMethod === "cash"}
//             onChange={(e) =>
//               setPaymentMethod(e.target.value)
//             }
//           />{" "}
//           Cash
//         </label>{" "}
//         &nbsp;&nbsp;

//         <label>
//           <input
//             type="radio"
//             value="upi"
//             checked={paymentMethod === "upi"}
//             onChange={(e) =>
//               setPaymentMethod(e.target.value)
//             }
//           />{" "}
//           UPI
//         </label>
//       </div>

//       {/* Generate */}
//       <button
//         style={styles.generateBtn}
//         onClick={generateBill}
//       >
//         ✅ Generate Bill
//       </button>
//     </div>
//   );
// };

// export default Billing;

// /* ================= STYLES ================= */

// const styles = {
//   page: {
//     padding: 14,
//     background: "#f8fafc",
//     minHeight: "100vh",
//   },

//   heading: {
//     fontSize: "22px",
//     fontWeight: "700",
//     marginBottom: 12,
//   },

//   card: {
//     background: "#fff",
//     padding: 14,
//     borderRadius: 10,
//     marginBottom: 14,
//     boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
//   },

//   sectionTitle: {
//     fontSize: "15px",
//     fontWeight: "600",
//     marginBottom: 6,
//   },

//   primaryBtn: {
//     padding: "10px",
//     width: "100%",
//     background: "#2563eb",
//     color: "#fff",
//     border: "none",
//     borderRadius: 6,
//     fontWeight: "600",
//   },

//   reader: {
//     width: "100%",
//     maxWidth: 260,
//     margin: "10px auto",
//   },

//   searchInput: {
//     width: "100%",
//     padding: 10,
//     borderRadius: 6,
//     border: "1px solid #cbd5e1",
//   },

//   dropdown: {
//     border: "1px solid #cbd5e1",
//     borderRadius: 6,
//     marginTop: 6,
//   },

//   dropdownItem: {
//     padding: 8,
//     cursor: "pointer",
//     borderBottom: "1px solid #eee",
//   },

//   table: {
//     width: "100%",
//     fontSize: "13px",
//     borderCollapse: "collapse",
//   },

//   qtyInput: {
//     width: 55,
//     padding: 4,
//   },

//   removeBtn: {
//     background: "#ef4444",
//     color: "#fff",
//     border: "none",
//     borderRadius: 4,
//     padding: "4px 6px",
//   },

//   totalBoxMain: {
//     display: "flex",
//     justifyContent: "space-between",
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: "700",
//   },

//   generateBtn: {
//     width: "100%",
//     padding: 14,
//     background: "#22c55e",
//     color: "#fff",
//     border: "none",
//     borderRadius: 10,
//     fontSize: 16,
//     fontWeight: "700",
//   },
// };
