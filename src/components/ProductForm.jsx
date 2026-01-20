import { useEffect, useState } from "react";
import API from "../api/api";

const ProductForm = ({ fetchProducts, editingProduct, setEditingProduct }) => {
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

    setForm({ name: "", barcode: "", price: "", stock: "", category: "" });
    fetchProducts();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{editingProduct ? "Edit Product" : "Add Product"}</h3>

      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
      <input name="barcode" placeholder="Barcode" value={form.barcode} onChange={handleChange} />
      <input name="price" placeholder="Price" value={form.price} onChange={handleChange} />
      <input name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} />
      <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />

      <button type="submit">
        {editingProduct ? "Update" : "Add"}
      </button>
    </form>
  );
};

export default ProductForm;
