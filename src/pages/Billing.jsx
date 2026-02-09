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

  /* ================= BARCODE SCANNER ================= */

  useEffect(() => {
    if (!scannerOn) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 220 },
      false
    );

    scanner.render(
      async (decodedText) => {
        await scanner.clear();
        setScannerOn(false);
        addProductByBarcode(decodedText);
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [scannerOn]);

  const addProductByBarcode = async (barcode) => {
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
      alert(`${product.name} is out of stock`);
      return;
    }

    const existing = items.find(
      (i) => i.barcode === product.barcode
    );

    if (existing) {
      if (existing.quantity + 1 > product.stock) {
        alert(`Only ${product.stock} items available`);
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
      alert(`Only ${item.stock} items available`);
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

  /* ================= REMOVE ITEM ================= */

  const removeItem = (barcode) => {
    setItems((prev) =>
      prev.filter((i) => i.barcode !== barcode)
    );
  };

  /* ================= CALCULATIONS ================= */

  const total = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  /* ================= GENERATE BILL ================= */

  const generateBill = async () => {
    if (items.length === 0) {
      alert("No items in bill");
      return;
    }

    const confirm = window.confirm(`
Items: ${items.length}
Total: ₹${total}
Payment: ${paymentMethod.toUpperCase()}
    `);

    if (!confirm) return;

    try {
      await API.post("/sales", {
        items: items.map((i) => ({
          barcode: i.barcode,
          quantity: i.quantity,
        })),
        paymentMethod,
      });

      alert("✅ Bill Generated Successfully");

      setItems([]);
      setPaymentMethod("cash");
      setSearch("");

      loadProducts(); // refresh stock
    } catch (err) {
      alert(err.response?.data?.message || "Billing failed");
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
          onClick={() => setScannerOn(true)}
        >
          📷 Scan Barcode
        </button>

        {scannerOn && (
          <div id="reader" style={styles.reader} />
        )}
      </div>

      {/* Manual Add */}
      <div style={styles.card}>
        <h4 style={styles.sectionTitle}>Add Product</h4>

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
                  style={{
                    ...styles.dropdownItem,
                    color:
                      p.stock > 0
                        ? "#0f172a"
                        : "#dc2626",
                  }}
                  onClick={() =>
                    p.stock > 0
                      ? (addItemToBill(p),
                        setSearch(""))
                      : alert("Out of stock")
                  }
                >
                  {p.name} — ₹{p.price} (Stock:
                  {p.stock})
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Bill Table */}
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
                    min="1"
                    value={i.quantity}
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

        {/* Total */}
        <div style={styles.totalBoxMain}>
          <span>Grand Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      {/* Payment */}
      <div style={styles.card}>
        <h4 style={styles.sectionTitle}>
          Payment Method
        </h4>

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
          UPI / Online
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
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: 12,
  },

  card: {
    background: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
  },

  sectionTitle: {
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: 6,
  },

  primaryBtn: {
    padding: "10px",
    width: "100%",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontWeight: "600",
  },

  reader: {
    width: "100%",
    maxWidth: 260,
    margin: "10px auto",
  },

  searchInput: {
    width: "100%",
    padding: 10,
    borderRadius: 6,
    border: "1px solid #cbd5e1",
  },

  dropdown: {
    border: "1px solid #cbd5e1",
    borderRadius: 6,
    marginTop: 6,
  },

  dropdownItem: {
    padding: 8,
    cursor: "pointer",
    borderBottom: "1px solid #eee",
  },

  table: {
    width: "100%",
    fontSize: "13px",
    borderCollapse: "collapse",
  },

  qtyInput: {
    width: 55,
    padding: 4,
  },

  removeBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    padding: "4px 6px",
  },

  totalBoxMain: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 8,
    fontSize: 18,
    fontWeight: "700",
  },

  generateBtn: {
    width: "100%",
    padding: 14,
    background: "#22c55e",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 16,
    fontWeight: "700",
  },
};






// import { Html5QrcodeScanner } from "html5-qrcode";
// import { useEffect, useState } from "react";
// import API from "../api/api";

// const Billing = () => {
//   const [items, setItems] = useState([]);
//   const [scannerOn, setScannerOn] = useState(false);

//   const [products, setProducts] = useState([]);
//   const [search, setSearch] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("cash");

//   /* ================= FETCH PRODUCTS ================= */
//   useEffect(() => {
//     API.get("/products").then((res) => setProducts(res.data));
//   }, []);

//   /* ================= BARCODE SCANNER ================= */
//   useEffect(() => {
//     if (!scannerOn) return;

//     const scanner = new Html5QrcodeScanner(
//       "reader",
//       { fps: 10, qrbox: 250 },
//       false
//     );

//     scanner.render(
//       async (decodedText) => {
//         scanner.clear();
//         setScannerOn(false);
//         addProductByBarcode(decodedText);
//       },
//       () => {}
//     );

//     return () => scanner.clear();
//   }, [scannerOn]);

//   const addProductByBarcode = async (barcode) => {
//     try {
//       const res = await API.get(`/products/barcode/${barcode}`);
//       addItemToBill(res.data);
//     } catch {
//       alert("Product not found");
//     }
//   };

//   /* ================= ADD ITEM LOGIC ================= */
//   const addItemToBill = (product) => {
//     if (product.stock <= 0) {
//       alert(`${product.name} is out of stock`);
//       return;
//     }

//     const existing = items.find(i => i.barcode === product.barcode);

//     if (existing) {
//       if (existing.quantity + 1 > product.stock) {
//         alert(`Only ${product.stock} items available`);
//         return;
//       }

//       setItems(items.map(i =>
//         i.barcode === product.barcode
//           ? { ...i, quantity: i.quantity + 1 }
//           : i
//       ));
//     } else {
//       setItems([
//         ...items,
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

//   const updateQty = (barcode, qty) => {
//     const item = items.find(i => i.barcode === barcode);
//     if (qty < 1 || qty > item.stock) {
//       alert(`Only ${item.stock} items available`);
//       return;
//     }

//     setItems(items.map(i =>
//       i.barcode === barcode ? { ...i, quantity: qty } : i
//     ));
//   };

//   const removeItem = (barcode) => {
//     setItems(items.filter(i => i.barcode !== barcode));
//   };

//   const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

//   /* ================= GENERATE BILL ================= */
//   const generateBill = async () => {
//     if (items.length === 0) {
//       alert("No items in bill");
//       return;
//     }

//     const confirmBill = window.confirm(
//       `Items: ${items.length}\nTotal: ₹${total}\nPayment: ${paymentMethod.toUpperCase()}`
//     );

//     if (!confirmBill) return;

//     try {
//       await API.post("/sales", {
//         items: items.map(i => ({
//           barcode: i.barcode,
//           quantity: i.quantity,
//         })),
//         paymentMethod,
//       });

//       alert("Bill generated successfully");
//       setItems([]);
//       setPaymentMethod("cash");
//     } catch (err) {
//       alert(err.response?.data?.message || "Billing failed");
//     }
//   };

//   return (
//     <div style={styles.page}>
//       <h2 style={styles.heading}>Cashier Billing</h2>

//       {/* Scanner */}
//       <div style={styles.card}>
//         <button style={styles.primaryBtn} onClick={() => setScannerOn(true)}>
//           Scan Barcode
//         </button>
//         {scannerOn && <div id="reader" style={styles.reader} />}
//       </div>

//       {/* Manual Add */}
//       <div style={styles.card}>
//         <h4 style={styles.sectionTitle}>Add Product</h4>
//         <input
//           placeholder="Search by product name or barcode"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           style={styles.searchInput}
//         />

//         {search && (
//           <div style={styles.dropdown}>
//             {products
//               .filter(
//                 p =>
//                   p.name.toLowerCase().includes(search.toLowerCase()) ||
//                   p.barcode.includes(search)
//               )
//               .slice(0, 6)
//               .map(p => (
//                 <div
//                   key={p._id}
//                   style={{
//                     ...styles.dropdownItem,
//                     color: p.stock > 0 ? "#0f172a" : "#dc2626",
//                   }}
//                   onClick={() =>
//                     p.stock > 0
//                       ? (addItemToBill(p), setSearch(""))
//                       : alert("Product out of stock")
//                   }
//                 >
//                   {p.name} — ₹{p.price} (Stock: {p.stock})
//                 </div>
//               ))}
//           </div>
//         )}
//       </div>

//       {/* Bill Table */}
//       <div style={styles.card}>
//         <table style={styles.table}>
//           <thead>
//             <tr>
//               <th>Product</th>
//               <th>Price</th>
//               <th>Qty</th>
//               <th>Total</th>
//               <th />
//             </tr>
//           </thead>
//           <tbody>
//             {items.map(i => (
//               <tr key={i.barcode}>
//                 <td>{i.name}</td>
//                 <td>₹{i.price}</td>
//                 <td>
//                   <input
//                     type="number"
//                     min="1"
//                     value={i.quantity}
//                     onChange={e => updateQty(i.barcode, Number(e.target.value))}
//                     style={styles.qtyInput}
//                   />
//                 </td>
//                 <td>₹{i.price * i.quantity}</td>
//                 <td>
//                   <button
//                     style={styles.removeBtn}
//                     onClick={() => removeItem(i.barcode)}
//                   >
//                     Remove
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         <div style={styles.totalBox}>
//           <span>Grand Total</span>
//           <span>₹{total}</span>
//         </div>
//       </div>

//       {/* Payment */}
//       <div style={styles.card}>
//         <h4 style={styles.sectionTitle}>Payment Method</h4>
//         <label>
//           <input
//             type="radio"
//             value="cash"
//             checked={paymentMethod === "cash"}
//             onChange={e => setPaymentMethod(e.target.value)}
//           /> Cash
//         </label>{" "}
//         <label>
//           <input
//             type="radio"
//             value="upi"
//             checked={paymentMethod === "upi"}
//             onChange={e => setPaymentMethod(e.target.value)}
//           /> Online
//         </label>
//       </div>

//       <button style={styles.generateBtn} onClick={generateBill}>
//         Generate Bill
//       </button>
//     </div>
//   );
// };

// export default Billing;


// const styles = {
//   page: {
//     padding: 16,
//     background: "#f8fafc",
//     minHeight: "100vh",
//   },

//   heading: {
//     fontSize: "22px",
//     fontWeight: "700",
//     marginBottom: 14,
//     color: "#0f172a",
//   },

//   card: {
//     background: "#ffffff",
//     padding: 16,
//     borderRadius: 10,
//     marginBottom: 16,
//     boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
//   },

//   sectionTitle: {
//     fontSize: "15px",
//     fontWeight: "600",
//     marginBottom: 8,
//   },

//   primaryBtn: {
//     padding: "10px 14px",
//     borderRadius: 6,
//     border: "none",
//     background: "#2563eb",
//     color: "#fff",
//     cursor: "pointer",
//   },

//   reader: {
//     width: 280,
//     marginTop: 12,
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
//     background: "#fff",
//   },

//   dropdownItem: {
//     padding: 8,
//     cursor: "pointer",
//   },

//   table: {
//     width: "100%",
//     borderCollapse: "collapse",
//     fontSize: "14px",
//   },

//   qtyInput: {
//     width: 60,
//     padding: 4,
//   },

//   removeBtn: {
//     background: "#ef4444",
//     color: "#fff",
//     border: "none",
//     borderRadius: 5,
//     padding: "4px 8px",
//     cursor: "pointer",
//   },

//   totalBox: {
//     display: "flex",
//     justifyContent: "space-between",
//     fontSize: "18px",
//     fontWeight: "700",
//     marginTop: 12,
//   },

//   generateBtn: {
//     width: "100%",
//     padding: 14,
//     background: "#22c55e",
//     color: "#fff",
//     border: "none",
//     borderRadius: 10,
//     fontSize: 16,
//     fontWeight: "600",
//     cursor: "pointer",
//   },
// };
