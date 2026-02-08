import { useEffect, useState } from "react";
import API from "../api/api";
import ProductForm from "../components/ProductForm";

const LOW_STOCK_LIMIT = 5;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState("");

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    fetchProducts();

    const resize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const fetchProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data);
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Delete this product?")) {
      await API.delete(`/products/${id}`);
      fetchProducts();
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.barcode.includes(search) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  // 🚨 Low stock products
  const lowStockProducts = products.filter(
    (p) => p.stock <= LOW_STOCK_LIMIT
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📦 Product Management</h2>

      {/* 🚨 LOW STOCK ALERT */}
      {lowStockProducts.length > 0 && (
        <div style={styles.alertBox}>
          ⚠️ <b>{lowStockProducts.length}</b> products are low in stock!
        </div>
      )}

      {/* Search */}
      <input
        type="text"
        placeholder="Search product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          ...styles.searchInput,
          width: isMobile ? "100%" : "320px",
        }}
      />

      {/* Form */}
      <div style={styles.card}>
        <ProductForm
          fetchProducts={fetchProducts}
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
        />
      </div>

      {/* MOBILE VIEW */}
      {isMobile ? (
        <div>
          {filteredProducts.length === 0 ? (
            <p style={styles.empty}>No products found</p>
          ) : (
            filteredProducts.map((p) => {
              const isLow = p.stock <= LOW_STOCK_LIMIT;

              return (
                <div
                  key={p._id}
                  style={{
                    ...styles.mobileCard,
                    border: isLow ? "2px solid #dc2626" : "none",
                  }}
                >
                  <h4>
                    {p.name}{" "}
                    {isLow && (
                      <span style={styles.lowBadge}>LOW</span>
                    )}
                  </h4>

                  <p>📌 Barcode: {p.barcode}</p>
                  <p>📂 Category: {p.category}</p>
                  <p>💰 Price: ₹{p.price}</p>
                  <p>
                    📦 Stock:{" "}
                    <b style={isLow ? styles.lowText : {}}>
                      {p.stock}
                    </b>
                  </p>

                  <div style={styles.mobileActions}>
                    <button
                      style={styles.editBtn}
                      onClick={() => setEditingProduct(p)}
                    >
                      Edit
                    </button>

                    <button
                      style={styles.deleteBtn}
                      onClick={() => deleteProduct(p._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* DESKTOP VIEW */
        <div style={styles.card}>
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Barcode</th>
                  <th>Category</th>
                  <th>Price (₹)</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={styles.empty}>
                      No products found
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const isLow = p.stock <= LOW_STOCK_LIMIT;

                    return (
                      <tr
                        key={p._id}
                        style={
                          isLow
                            ? { background: "#fee2e2" }
                            : {}
                        }
                      >
                        <td>
                          {p.name}{" "}
                          {isLow && (
                            <span style={styles.lowBadge}>
                              LOW
                            </span>
                          )}
                        </td>

                        <td>{p.barcode}</td>
                        <td>{p.category}</td>
                        <td>₹{p.price}</td>

                        <td>
                          <b style={isLow ? styles.lowText : {}}>
                            {p.stock}
                          </b>
                        </td>

                        <td>
                          <button
                            style={styles.editBtn}
                            onClick={() =>
                              setEditingProduct(p)
                            }
                          >
                            Edit
                          </button>

                          <button
                            style={styles.deleteBtn}
                            onClick={() =>
                              deleteProduct(p._id)
                            }
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;

/* ================= STYLES ================= */

const styles = {
  container: {
    padding: "16px",
    background: "#f8fafc",
    minHeight: "100vh",
  },

  heading: {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "12px",
    color: "#0f172a",
  },

  /* 🚨 Alert */

  alertBox: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "12px",
    fontSize: "14px",
    fontWeight: "600",
  },

  lowBadge: {
    background: "#dc2626",
    color: "#fff",
    fontSize: "11px",
    padding: "2px 6px",
    borderRadius: "4px",
    marginLeft: "6px",
  },

  lowText: {
    color: "#dc2626",
  },

  searchInput: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    marginBottom: "14px",
  },

  card: {
    background: "#ffffff",
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "18px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },

  empty: {
    textAlign: "center",
    padding: "16px",
    color: "#64748b",
  },

  /* Mobile */

  mobileCard: {
    background: "#ffffff",
    borderRadius: "10px",
    padding: "14px",
    marginBottom: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },

  mobileActions: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },

  editBtn: {
    flex: 1,
    padding: "8px",
    borderRadius: "6px",
    border: "none",
    background: "#4f46e5",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
  },

  deleteBtn: {
    flex: 1,
    padding: "8px",
    borderRadius: "6px",
    border: "none",
    background: "#dc2626",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
  },
};
