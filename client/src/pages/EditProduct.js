import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useNavigate, useParams } from 'react-router-dom';

function EditProduct() {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchProduct();
    }, []);

    const fetchProduct = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/products/${id}`);
            setName(data.name);
            setPrice(data.price);
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_BASE_URL}/api/admin/products/${id}`, { name, price }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            navigate('/admin');
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    return (
        <div className="container my-5">
            <h2>Edit Product</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Price</label>
                    <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">Update Product</button>
            </form>
        </div>
    );
}

export default EditProduct;
