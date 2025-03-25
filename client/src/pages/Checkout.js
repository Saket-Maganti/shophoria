import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { jwtDecode } from 'jwt-decode';  // ✅ Correct way to import


function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    images: [''],
  });
  const [editProduct, setEditProduct] = useState(null);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setIsAdmin(decoded.user.isAdmin);
    }
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products`);
        setProducts(response.data);
      } catch (err) {
        setError('Error fetching products');
      }
    };

    fetchProducts();
  }, []);

  const handleNewProductChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setNewProduct({
      ...newProduct,
      images: [e.target.value],
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/api/products`,
        newProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts([...products, response.data]);
      setNewProduct({ name: '', description: '', price: '', category: '', images: [''] });
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error adding product');
    }
  };

  const handleEditProductChange = (e) => {
    setEditProduct({
      ...editProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditImageChange = (e) => {
    setEditProduct({
      ...editProduct,
      images: [e.target.value],
    });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_BASE_URL}/api/products/${editProduct._id}`,
        editProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts(products.map(p => (p._id === editProduct._id ? response.data : p)));
      setEditProduct(null);
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error updating product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts(products.filter(p => p._id !== productId));
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error deleting product');
    }
  };

  if (!isAdmin) {
    return <div className="container my-4">Access denied. Admins only.</div>;
  }

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">Admin Panel - Manage Products</h1>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Add Product Form */}
      <h3>Add New Product</h3>
      <form onSubmit={handleAddProduct} className="mb-5">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={newProduct.name}
            onChange={handleNewProductChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={newProduct.description}
            onChange={handleNewProductChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            id="price"
            name="price"
            value={newProduct.price}
            onChange={handleNewProductChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <input
            type="text"
            className="form-control"
            id="category"
            name="category"
            value={newProduct.category}
            onChange={handleNewProductChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="images" className="form-label">Image URL</label>
          <input
            type="text"
            className="form-control"
            id="images"
            value={newProduct.images[0]}
            onChange={handleImageChange}
            placeholder="Enter image URL"
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Product</button>
      </form>

      {/* Edit Product Form */}
      {editProduct && (
        <div className="mb-5">
          <h3>Edit Product</h3>
          <form onSubmit={handleUpdateProduct}>
            <div className="mb-3">
              <label htmlFor="editName" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="editName"
                name="name"
                value={editProduct.name}
                onChange={handleEditProductChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="editDescription" className="form-label">Description</label>
              <textarea
                className="form-control"
                id="editDescription"
                name="description"
                value={editProduct.description}
                onChange={handleEditProductChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="editPrice" className="form-label">Price</label>
              <input
                type="number"
                className="form-control"
                id="editPrice"
                name="price"
                value={editProduct.price}
                onChange={handleEditProductChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="editCategory" className="form-label">Category</label>
              <input
                type="text"
                className="form-control"
                id="editCategory"
                name="category"
                value={editProduct.category}
                onChange={handleEditProductChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="editImages" className="form-label">Image URL</label>
              <input
                type="text"
                className="form-control"
                id="editImages"
                value={editProduct.images[0]}
                onChange={handleEditImageChange}
              />
            </div>
            <button type="submit" className="btn btn-primary me-2">Update Product</button>
            <button type="button" className="btn btn-secondary" onClick={() => setEditProduct(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Product List */}
      <h3>Products</h3>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <ul className="list-group">
          {products.map(product => (
            <li key={product._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                {product.name} - ${product.price} ({product.category})
              </div>
              <div>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => setEditProduct(product)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteProduct(product._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminPanel;