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

  return (
    <div>
      <h2>📦 Product Management</h2>

      <input
        placeholder="Search by name / barcode / category"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: 300, padding: 6 }}
      />

      <hr />

      <ProductForm
        fetchProducts={fetchProducts}
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
      />

      <hr />

      <table border="1" width="100%" cellPadding="6">
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
          {filteredProducts.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.barcode}</td>
              <td>{p.category}</td>
              <td>₹{p.price}</td>
              <td>{p.stock}</td>
              <td>
                <button onClick={() => setEditingProduct(p)}>
                  Edit
                </button>{" "}
                <button onClick={() => deleteProduct(p._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
