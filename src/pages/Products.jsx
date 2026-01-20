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
    if (window.confirm("Are you sure you want to delete this product?")) {
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

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Product Management</h2>

      {/* Search */}
      <div style={styles.searchBox}>
        <input
          type="text"
          placeholder="Search by name, barcode or category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* Product Form */}
      <div style={styles.card}>
        <ProductForm
          fetchProducts={fetchProducts}
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
        />
      </div>

      {/* Product Table */}
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Barcode</th>
              <th>Category</th>
              <th>Price (₹)</th>
              <th>Stock</th>
              <th style={{ textAlign: "center" }}>Actions</th>
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
              filteredProducts.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.barcode}</td>
                  <td>{p.category}</td>
                  <td>₹{p.price}</td>
                  <td>{p.stock}</td>
                  <td style={{ textAlign: "center" }}>
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;

const styles = {
  container: {
    padding: "20px",
    background: "#f8fafc",
    minHeight: "100vh",
  },

  heading: {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "16px",
    color: "#0f172a",
  },

  searchBox: {
    marginBottom: "16px",
  },

  searchInput: {
    width: "320px",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
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

  editBtn: {
    padding: "6px 10px",
    marginRight: "6px",
    borderRadius: "5px",
    border: "none",
    background: "#4f46e5",
    color: "#fff",
    cursor: "pointer",
    fontSize: "13px",
  },

  deleteBtn: {
    padding: "6px 10px",
    borderRadius: "5px",
    border: "none",
    background: "#dc2626",
    color: "#fff",
    cursor: "pointer",
    fontSize: "13px",
  },
};
