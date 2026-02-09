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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name,
        barcode: editingProduct.barcode,
        price: editingProduct.price,
        stock: editingProduct.stock,
        category: editingProduct.category,
      });
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      barcode: "",
      price: "",
      stock: "",
      category: "",
    });

    setEditingProduct(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      };

      if (editingProduct) {
        await API.put(
          `/products/${editingProduct._id}`,
          payload
        );
      } else {
        await API.post("/products", payload);
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>
        {editingProduct ? "Update Product" : "Add Product"}
      </h4>

      {error && (
        <p style={{ color: "red", fontSize: 13 }}>
          {error}
        </p>
      )}

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

      <br />
      <br />

      <button type="submit" disabled={loading}>
        {loading
          ? "Saving..."
          : editingProduct
          ? "Update"
          : "Add"}
      </button>

      {editingProduct && (
        <button
          type="button"
          onClick={resetForm}
          style={{ marginLeft: 10 }}
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default ProductForm;




// import { useEffect, useState } from "react";
// import API from "../api/api";

// const ProductForm = ({
//   fetchProducts,
//   editingProduct,
//   setEditingProduct,
// }) => {
//   const [form, setForm] = useState({
//     name: "",
//     barcode: "",
//     price: "",
//     stock: "",
//     category: "",
//   });

//   useEffect(() => {
//     if (editingProduct) {
//       setForm(editingProduct);
//     }
//   }, [editingProduct]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (editingProduct) {
//       await API.put(`/products/${editingProduct._id}`, form);
//       setEditingProduct(null);
//     } else {
//       await API.post("/products", form);
//     }

//     setForm({
//       name: "",
//       barcode: "",
//       price: "",
//       stock: "",
//       category: "",
//     });

//     fetchProducts();
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h4>{editingProduct ? "Update Product" : "Add Product"}</h4>

//       <input
//         name="name"
//         placeholder="Product Name"
//         value={form.name}
//         onChange={handleChange}
//         required
//       />

//       <input
//         name="barcode"
//         placeholder="Barcode"
//         value={form.barcode}
//         onChange={handleChange}
//         required
//       />

//       <input
//         type="number"
//         name="price"
//         placeholder="Price"
//         value={form.price}
//         onChange={handleChange}
//         required
//       />

//       <input
//         type="number"
//         name="stock"
//         placeholder="Stock"
//         value={form.stock}
//         onChange={handleChange}
//         required
//       />

//       <input
//         name="category"
//         placeholder="Category"
//         value={form.category}
//         onChange={handleChange}
//       />

//       <br /><br />

//       <button type="submit">
//         {editingProduct ? "Update" : "Add"}
//       </button>

//       {editingProduct && (
//         <button
//           type="button"
//           onClick={() => setEditingProduct(null)}
//         >
//           Cancel
//         </button>
//       )}
//     </form>
//   );
// };

// export default ProductForm;
