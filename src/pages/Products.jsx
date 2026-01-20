import { useEffect, useState } from "react";
import API from "../api/api";
import ProductForm from "../components/ProductForm";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    if (window.confirm("Delete product?")) {
      await API.delete(`/products/${id}`);
      fetchProducts();
    }
  };

  /* 🔎 Filter */
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.barcode.includes(search) ||
      (p.category || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>📦 Product Management</h2>

      {/* Search */}
      <div style={styles.card}>
        <input
          placeholder="🔎 Search by name / barcode / category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />
      </div>

      {/* Add / Edit Form */}
      <div style={styles.card}>
        <ProductForm
          fetchProducts={fetchProducts}
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
        />
      </div>

      {/* Table */}
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    ❌ No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>{p.barcode}</td>
                    <td>{p.category || "-"}</td>
                    <td>₹{p.price}</td>
                    <td
                      style={{
                        color: p.stock === 0 ? "red" : "green",
                        fontWeight: "600",
                      }}
                    >
                      {p.stock}
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <button
                        style={styles.editBtn}
                        onClick={() => setEditingProduct(p)}
                      >
                        ✏️ Edit
                      </button>{" "}
                      <button
                        style={styles.deleteBtn}
                        onClick={() => deleteProduct(p._id)}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;

/* ================= STYLES ================= */

const styles = {
  page: {
    padding: 15,
    background: "#f8fafc",
    minHeight: "100vh",
  },

  title: {
    marginBottom: 10,
    fontSize: 22,
    fontWeight: 700,
  },

  card: {
    background: "#ffffff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  },

  search: {
    width: "100%",
    maxWidth: 400,
    padding: 8,
    fontSize: 14,
    borderRadius: 6,
    border: "1px solid #d1d5db",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  editBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "4px 8px",
    cursor: "pointer",
  },

  deleteBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "4px 8px",
    cursor: "pointer",
  },
};
