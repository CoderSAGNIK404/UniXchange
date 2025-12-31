import React, { useState } from 'react';
import { Package, Plus, Edit, Trash2 } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';
import AddProductModal from '../components/AddProductModal';

const SellerProducts = () => {
    const { products, addProduct, updateProduct, deleteProduct } = useMarketplace();
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const handleAdd = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(id);
        }
    };

    const handleSave = (data) => {
        if (editingProduct) {
            updateProduct(editingProduct.id, data);
        } else {
            addProduct({
                ...data,
                seller: user?.storeName || user?.name || "Seller",
                sellerId: user?.name,
                sellerEmail: user?.email, // Robust linking
            });
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', color: 'var(--text-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>My Products</h1>
                <button
                    onClick={handleAdd}
                    style={{
                        padding: '0.8rem 1.5rem',
                        background: 'var(--primary-color)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    <Plus size={20} /> Add Product
                </button>
            </div>

            <div style={{ background: 'var(--card-bg)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'var(--hover-bg)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Product Name</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Price</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Stock</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Status</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} style={{ borderTop: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', background: 'var(--hover-bg)', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {product.image ? (
                                            <img src={product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <Package size={20} color="var(--text-secondary)" />
                                        )}
                                    </div>
                                    <span style={{ fontWeight: 500 }}>{product.title}</span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {['₹', '$', '€', '£'].some(s => product.price.startsWith(s)) ? product.price : `₹${product.price}`}
                                </td>
                                <td style={{ padding: '1rem' }}>{product.stock}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        background: product.stock > 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                        color: product.stock > 0 ? '#10b981' : '#ef4444',
                                        fontSize: '0.85rem'
                                    }}>
                                        {product.stock > 0 ? 'Active' : 'Out of Stock'}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => handleEdit(product)}
                                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AddProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={editingProduct}
            />
        </div>
    );
};

export default SellerProducts;
