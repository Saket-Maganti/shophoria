import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useNavigate } from 'react-router-dom';

function AddProduct() {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/api/admin/products`, { name, price }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            navigate('/admin');
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    return (
        <div className="container my-5">
            <h2>Add Product</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Price</label>
                    <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">Add Product</button>
            </form>
        </div>
    );
}

export default AddProduct;
