import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingCart, Truck, Shield, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const ProductDetailModal = ({ product, onClose }) => {
    const { addToCart } = useCart();
    const { addToast } = useToast();
    const navigate = useNavigate();

    if (!product) return null;

    const discountClass = product.originalPrice ? Math.round((1 - (parseFloat(product.price.replace(/[^\d.]/g, '')) / parseFloat(product.originalPrice.replace(/[^\d.]/g, '')))) * 100) : 0;

    const handleAddToCart = () => {
        addToCart(product);
        addToast(`${product.title} added to cart!`);
    };

    const handleBuyNow = () => {
        addToCart(product);
        navigate('/app/cart');
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.7)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    backdropFilter: 'blur(5px)'
                }}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        background: 'var(--card-bg)',
                        borderRadius: '24px',
                        width: '100%',
                        maxWidth: '1000px',
                        maxHeight: '90vh',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        border: '1px solid var(--border-color)'
                    }}
                >
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            background: 'rgba(0,0,0,0.5)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#fff',
                            zIndex: 10
                        }}
                    >
                        <X size={20} />
                    </button>

                    {/* Main Content Area - Scrollable */}
                    <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                        {/* Left Side - Image */}
                        <div style={{ position: 'relative', minHeight: '300px', background: '#f8fafc' }}>
                            <img
                                src={product.image}
                                alt={product.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute' }}
                            />
                        </div>

                        {/* Right Side - Details */}
                        <div style={{ padding: '3rem' }}>
                            <div style={{ fontSize: '0.9rem', color: 'var(--primary-color)', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                {product.category}
                            </div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', lineHeight: 1.2 }}>
                                {product.title}
                            </h2>

                            {/* Rating */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', background: '#f59e0b', padding: '4px 8px', borderRadius: '6px', color: '#fff', fontWeight: 'bold', gap: '4px' }}>
                                    {product.rating} <Star size={14} fill="#fff" />
                                </div>
                                <span style={{ color: 'var(--text-secondary)' }}>{product.reviews} ratings</span>
                                <span style={{ color: 'var(--text-secondary)' }}>•</span>
                                <span style={{ color: '#10b981', fontWeight: 600 }}>In Stock</span>
                            </div>

                            {/* Price */}
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '2rem' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                                    {['₹', '$'].some(s => product.price.startsWith(s)) ? product.price : `₹${product.price}`}
                                </span>
                                {product.originalPrice && (
                                    <>
                                        <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>
                                            {product.originalPrice}
                                        </span>
                                        <span style={{ color: '#ef4444', fontWeight: 'bold' }}>
                                            {discountClass}% OFF
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Description */}
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>About this item</h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                    This {product.title} is perfect for your university needs.
                                    High quality, reliable, and exactly what you need for your courses or dorm life.
                                    Sold by <strong>{product.seller || 'Verified Seller'}</strong> who is a trusted member of the UniXchange community.
                                </p>
                            </div>

                            {/* Features / Trust Badges */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--hover-bg)', borderRadius: '12px' }}>
                                    <Truck size={24} style={{ marginBottom: '0.5rem', color: 'var(--primary-color)' }} />
                                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Fast Delivery</div>
                                </div>
                                <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--hover-bg)', borderRadius: '12px' }}>
                                    <Shield size={24} style={{ marginBottom: '0.5rem', color: 'var(--primary-color)' }} />
                                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Secure Pay</div>
                                </div>
                                <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--hover-bg)', borderRadius: '12px' }}>
                                    <RotateCcw size={24} style={{ marginBottom: '0.5rem', color: 'var(--primary-color)' }} />
                                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Easy Returns</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions - Always Visible at Bottom */}
                    <div style={{
                        padding: '1.5rem 3rem',
                        borderTop: '1px solid var(--border-color)',
                        background: 'var(--card-bg)',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1.5rem',
                        boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
                        zIndex: 20
                    }}>
                        <button
                            onClick={handleAddToCart}
                            style={{
                                padding: '1rem',
                                borderRadius: '12px',
                                background: 'transparent',
                                border: '2px solid var(--primary-color)',
                                color: 'var(--primary-color)',
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.8rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            <ShoppingCart size={20} /> Add to Cart
                        </button>
                        <button
                            onClick={handleBuyNow}
                            style={{
                                padding: '1rem',
                                borderRadius: '12px',
                                background: 'var(--primary-color)',
                                border: 'none',
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                                cursor: 'pointer',
                                boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            Buy Now
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ProductDetailModal;
