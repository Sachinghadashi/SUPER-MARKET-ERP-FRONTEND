import { useEffect, useState } from "react";
import API from "../api/api";
import ProductForm from "../components/ProductForm";

const LOW_STOCK_LIMIT = 5;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= LOAD PRODUCTS ================= */

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch {
      alert("Failed to load products");
    }
  };

  /* ================= DELETE ================= */

  const deleteProduct = async (id) => {
    if (window.confirm("Delete this product?")) {
      await API.delete(`/products/${id}`);
      fetchProducts();
    }
  };

  /* ================= FILTER ================= */

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.barcode.includes(search) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= LOW STOCK ================= */

  const lowStockProducts = products.filter(
    (p) => p.stock <= LOW_STOCK_LIMIT
  );

  /* ================= UI ================= */

  return (
    <div className="container-fluid bg-light min-vh-100 p-3">

      {/* ================= HEADER ================= */}

      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="card-body">

          <h3 className="fw-bold text-primary mb-3">
            📦 Product Management
          </h3>

          {/* Low Stock Alert */}
          {lowStockProducts.length > 0 && (
            <div className="alert alert-danger fw-semibold">
              ⚠️ {lowStockProducts.length} products are low in stock!
            </div>
          )}

          {/* Search */}
          <input
            type="text"
            className="form-control mb-3"
            placeholder="🔍 Search by name / barcode / category"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>
      </div>

      {/* ================= PRODUCT FORM ================= */}

      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="card-body">

          <ProductForm
            fetchProducts={fetchProducts}
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
          />

        </div>
      </div>

      {/* ================= TABLE ================= */}

      <div className="card shadow-sm border-0 rounded-4">

        <div className="card-body p-0">

          <div className="table-responsive">

            <table className="table table-bordered table-hover align-middle text-center mb-0">

              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Barcode</th>
                  <th>Category</th>
                  <th>Price (₹)</th>
                  <th>Stock</th>
                  <th width="180">Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-muted py-4">
                      No products found
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const isLow = p.stock <= LOW_STOCK_LIMIT;

                    return (
                      <tr
                        key={p._id}
                        className={isLow ? "table-danger" : ""}
                      >

                        <td>
                          {p.name}

                          {isLow && (
                            <span className="badge bg-danger ms-2">
                              LOW
                            </span>
                          )}
                        </td>

                        <td>{p.barcode}</td>

                        <td>{p.category}</td>

                        <td>₹{p.price}</td>

                        <td className="fw-bold">
                          {p.stock}
                        </td>

                        <td>

                          <button
                            className="btn btn-sm btn-primary me-2"
                            onClick={() =>
                              setEditingProduct(p)
                            }
                          >
                            ✏️ Edit
                          </button>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() =>
                              deleteProduct(p._id)
                            }
                          >
                            🗑 Delete
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

      </div>

    </div>
  );
};

export default Products;