import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    images: ['']
  });
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchProducts();
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products`);
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/products`, newProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Product added successfully!');
      setNewProduct({ name: '', description: '', price: '', category: '', images: [''] });
      fetchProducts();
    } catch (err) {
      alert('Failed to add product: ' + (err.response?.data?.msg || 'Server error'));
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/api/products/${editProduct._id}`, editProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Product updated successfully!');
      setEditProduct(null);
      fetchProducts();
    } catch (err) {
      alert('Failed to update product: ' + (err.response?.data?.msg || 'Server error'));
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Product deleted successfully!');
        fetchProducts();
      } catch (err) {
        alert('Failed to delete product: ' + (err.response?.data?.msg || 'Server error'));
      }
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Admin Dashboard</h2>

      {/* Add Product Form */}
      <div className="card shadow p-4 mb-5">
        <h3>Add New Product</h3>
        <form onSubmit={handleAddProduct}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <input
              type="text"
              className="form-control"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Price</label>
            <input
              type="number"
              className="form-control"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Category</label>
            <input
              type="text"
              className="form-control"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Image URL</label>
            <input
              type="text"
              className="form-control"
              value={newProduct.images[0]}
              onChange={(e) => setNewProduct({ ...newProduct, images: [e.target.value] })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Add Product</button>
        </form>
      </div>

      {/* Product List */}
      <h3 className="mb-4">Manage Products</h3>
      <div className="row">
        {products.map(product => (
          <div key={product._id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <img
                src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/150'}
                className="card-img-top"
                alt={product.name}
                style={{ height: '200px', objectFit: 'cover' }}
                onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
              />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text text-muted">{product.description}</p>
                <p className="card-text fw-bold">${product.price.toFixed(2)}</p>
                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-warning btn-sm"
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
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Product Modal */}
      {editProduct && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Product</h5>
                <button type="button" className="btn-close" onClick={() => setEditProduct(null)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleUpdateProduct}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editProduct.name}
                      onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editProduct.description}
                      onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Price</label>
                    <input
                      type="number"
                      className="form-control"
                      value={editProduct.price}
                      onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editProduct.category}
                      onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Image URL</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editProduct.images[0]}
                      onChange={(e) => setEditProduct({ ...editProduct, images: [e.target.value] })}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Update Product</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;