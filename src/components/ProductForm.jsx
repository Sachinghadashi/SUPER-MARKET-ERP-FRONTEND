import { useEffect, useState } from "react";
import API from "../api/api";

const ProductForm = ({
  fetchProducts,
  editingProduct,
  setEditingProduct,
}) => {
  const [form, setForm] = useState({
    name: "",
    barcode: "",
    price: "",
    stock: "",
    category: "",
  });

  useEffect(() => {
    if (editingProduct) {
      setForm(editingProduct);
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingProduct) {
      await API.put(`/products/${editingProduct._id}`, form);
      setEditingProduct(null);
    } else {
      await API.post("/products", form);
    }

    setForm({
      name: "",
      barcode: "",
      price: "",
      stock: "",
      category: "",
    });

    fetchProducts();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>{editingProduct ? "Update Product" : "Add Product"}</h4>

      <input
        name="name"
        placeholder="Product Name"
        value={form.name}
        onChange={handleChange}
        required
      />

      <input
        name="barcode"
        placeholder="Barcode"
        value={form.barcode}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="price"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="stock"
        placeholder="Stock"
        value={form.stock}
        onChange={handleChange}
        required
      />

      <input
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
      />

      <br /><br />

      <button type="submit">
        {editingProduct ? "Update" : "Add"}
      </button>

      {editingProduct && (
        <button
          type="button"
          onClick={() => setEditingProduct(null)}
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default ProductForm;
