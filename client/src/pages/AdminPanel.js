import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { jwtDecode } from 'jwt-decode';

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

  // ✅ Check if user is admin safely
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAdmin(decoded?.isAdmin || false);
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  // ✅ Fetch products
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

  // ✅ Handle form input changes
  const handleNewProductChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setNewProduct({ ...newProduct, images: [e.target.value || ''] });
  };

  // ✅ Handle product edits
  const handleEditProductChange = (e) => {
    setEditProduct({ ...editProduct, [e.target.name]: e.target.value });
  };

  const handleEditImageChange = (e) => {
    setEditProduct({ ...editProduct, images: [e.target.value || ''] });
  };

  // ✅ Handle form submission for adding a new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/api/products`, newProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts([...products, response.data]);
      setNewProduct({ name: '', description: '', price: '', category: '', images: [''] });
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error adding product');
    }
  };

  // ✅ Handle form submission for updating a product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_BASE_URL}/api/products/${editProduct._id}`,
        editProduct,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProducts(products.map(p => (p._id === editProduct._id ? response.data : p)));
      setEditProduct(null);
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error updating product');
    }
  };

  // ✅ Handle deleting a product
  const handleDeleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
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
        <input type="text" className="form-control mb-2" name="name" placeholder="Name" value={newProduct.name} onChange={handleNewProductChange} required />
        <textarea className="form-control mb-2" name="description" placeholder="Description" value={newProduct.description} onChange={handleNewProductChange} required />
        <input type="number" className="form-control mb-2" name="price" placeholder="Price" value={newProduct.price} onChange={handleNewProductChange} required />
        <input type="text" className="form-control mb-2" name="category" placeholder="Category" value={newProduct.category} onChange={handleNewProductChange} required />
        <input type="text" className="form-control mb-2" placeholder="Image URL" value={newProduct.images?.[0] || ''} onChange={handleImageChange} />
        <button type="submit" className="btn btn-primary">Add Product</button>
      </form>

      {/* Edit Product Form */}
      {editProduct && (
        <div className="mb-5">
          <h3>Edit Product</h3>
          <form onSubmit={handleUpdateProduct}>
            <input type="text" className="form-control mb-2" name="name" placeholder="Name" value={editProduct.name} onChange={handleEditProductChange} required />
            <textarea className="form-control mb-2" name="description" placeholder="Description" value={editProduct.description} onChange={handleEditProductChange} required />
            <input type="number" className="form-control mb-2" name="price" placeholder="Price" value={editProduct.price} onChange={handleEditProductChange} required />
            <input type="text" className="form-control mb-2" name="category" placeholder="Category" value={editProduct.category} onChange={handleEditProductChange} required />
            <input type="text" className="form-control mb-2" placeholder="Image URL" value={editProduct.images?.[0] || ''} onChange={handleEditImageChange} />
            <button type="submit" className="btn btn-primary me-2">Update Product</button>
            <button type="button" className="btn btn-secondary" onClick={() => setEditProduct(null)}>Cancel</button>
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
              <div>{product.name} - ${product.price} ({product.category})</div>
              <div>
                <button className="btn btn-warning btn-sm me-2" onClick={() => setEditProduct(product)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProduct(product._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminPanel;
