import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload } from 'lucide-react';

const AddProductModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState(initialData || {
        title: '',
        price: '',
        category: 'Textbooks',
        currency: 'INR',
        stock: 1,
        image: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        const symbol = formData.currency === 'USD' ? '$' :
            formData.currency === 'EUR' ? '€' :
                formData.currency === 'GBP' ? '£' : '₹';

        let finalPrice = formData.price.trim();
        // If price doesn't start with any currency symbol (checking common ones), prepend the selected one
        if (!['₹', '$', '€', '£'].some(s => finalPrice.startsWith(s))) {
            finalPrice = `${symbol}${finalPrice}`;
        } else if (finalPrice.startsWith(symbol)) {
            // Already has correct symbol
        } else {
            // Has different symbol, replace it
            finalPrice = `${symbol}${finalPrice.substring(1)}`;
        }

        onSave({ ...formData, price: finalPrice });
        onClose();
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.8)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem'
                }}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    style={{
                        background: '#1e1e24',
                        borderRadius: '20px',
                        padding: '2rem',
                        width: '100%',
                        maxWidth: '500px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        position: 'relative'
                    }}
                >
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            background: 'transparent',
                            border: 'none',
                            color: '#fff',
                            cursor: 'pointer'
                        }}
                    >
                        <X size={24} />
                    </button>

                    <h2 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
                        {initialData ? 'Edit Product' : 'Add New Product'}
                    </h2>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', color: '#a1a1aa', marginBottom: '0.5rem' }}>Product Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    borderRadius: '8px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    outline: 'none'
                                }}
                                required
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', color: '#a1a1aa', marginBottom: '0.5rem' }}>Currency</label>
                                <select
                                    value={formData.currency}
                                    onChange={e => setFormData({ ...formData, currency: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem',
                                        borderRadius: '8px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: '#fff',
                                        outline: 'none'
                                    }}
                                >
                                    <option value="INR" style={{ background: '#1e1e24', color: '#fff' }}>INR (₹)</option>
                                    <option value="USD" style={{ background: '#1e1e24', color: '#fff' }}>USD ($)</option>
                                    <option value="EUR" style={{ background: '#1e1e24', color: '#fff' }}>EUR (€)</option>
                                    <option value="GBP" style={{ background: '#1e1e24', color: '#fff' }}>GBP (£)</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', color: '#a1a1aa', marginBottom: '0.5rem' }}>Price</label>
                                <input
                                    type="text"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    placeholder={formData.currency === 'INR' ? "₹0.00" : formData.currency === 'USD' ? "$0.00" : "0.00"}
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem',
                                        borderRadius: '8px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: '#fff',
                                        outline: 'none'
                                    }}
                                    required
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', color: '#a1a1aa', marginBottom: '0.5rem' }}>Stock</label>
                                <input
                                    type="number"
                                    value={formData.stock}
                                    onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem',
                                        borderRadius: '8px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: '#fff',
                                        outline: 'none'
                                    }}
                                    min="0"
                                    required
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', color: '#a1a1aa', marginBottom: '0.5rem' }}>Category</label>
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem',
                                        borderRadius: '8px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: '#fff',
                                        outline: 'none'
                                    }}
                                >
                                    <option value="Textbooks" style={{ background: '#1e1e24', color: '#fff' }}>Textbooks</option>
                                    <option value="Electronics" style={{ background: '#1e1e24', color: '#fff' }}>Electronics</option>
                                    <option value="Clothing" style={{ background: '#1e1e24', color: '#fff' }}>Clothing</option>
                                    <option value="Stationery" style={{ background: '#1e1e24', color: '#fff' }}>Stationery</option>
                                    <option value="Dorm Essentials" style={{ background: '#1e1e24', color: '#fff' }}>Dorm Essentials</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', color: '#a1a1aa', marginBottom: '0.5rem' }}>Product Images</label>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                                {/* Upload Button */}
                                <label style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '12px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px dashed rgba(255,255,255,0.3)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: '#a1a1aa',
                                    transition: 'all 0.2s',
                                }}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        hidden
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files);
                                            Promise.all(files.map(file => {
                                                return new Promise((resolve, reject) => {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => resolve(reader.result);
                                                    reader.onerror = reject;
                                                    reader.readAsDataURL(file);
                                                });
                                            })).then(results => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    image: results[0] || prev.image, // Keep existing if no new one, else take first
                                                    images: [...(prev.images || []), ...results]
                                                }));
                                            });
                                        }}
                                    />
                                    <Upload size={20} style={{ marginBottom: '4px' }} />
                                    <span style={{ fontSize: '0.7rem' }}>Add</span>
                                </label>

                                {/* Image Previews */}
                                {(formData.images || (formData.image ? [formData.image] : [])).map((img, index) => (
                                    <div key={index} style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}>
                                        <img src={img} alt={`Preview ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newImages = (formData.images || [formData.image]).filter((_, i) => i !== index);
                                                setFormData({
                                                    ...formData,
                                                    images: newImages,
                                                    image: newImages[0] || ''
                                                });
                                            }}
                                            style={{
                                                position: 'absolute',
                                                top: '2px',
                                                right: '2px',
                                                background: 'rgba(0,0,0,0.6)',
                                                border: 'none',
                                                borderRadius: '50%',
                                                padding: '2px',
                                                cursor: 'pointer',
                                                color: '#fff',
                                                display: 'flex'
                                            }}
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            style={{
                                marginTop: '1rem',
                                padding: '1rem',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                                color: '#fff',
                                border: 'none',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontSize: '1rem'
                            }}
                        >
                            {initialData ? 'Save Changes' : 'Add Product'}
                        </button>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AddProductModal;
