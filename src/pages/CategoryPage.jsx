import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Heart, Minus, Plus, Star } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const CategoryPage = () => {
    const { categoryName } = useParams();
    const navigate = useNavigate();
    const { products } = useMarketplace();
    const { user, toggleFavorite } = useAuth();
    const { cartItems, addToCart, decreaseQuantity } = useCart();
    const { addToast } = useToast();

    // Filter products by the category name from URL
    const categoryProducts = products.filter(p => p.category === categoryName);

    const isFavorite = (itemId) => {
        return user?.favorites?.some(fav => fav.id === itemId);
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', color: 'var(--text-color)' }}>
            <button
                onClick={() => navigate(-1)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    marginBottom: '1.5rem'
                }}
            >
                <ArrowLeft size={20} /> Back
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>
                    {categoryName}
                </h1>

                {categoryProducts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                        <p>No products found in this category yet.</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '2rem'
                    }}>
                        {categoryProducts.map(item => (
                            <motion.div
                                key={item.id}
                                whileHover={{ y: -8 }}
                                style={{
                                    background: 'var(--card-bg)',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    border: '1px solid var(--border-color)',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFavorite(item);
                                        }}
                                        style={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '10px',
                                            background: 'rgba(255,255,255,0.9)',
                                            border: 'none',
                                            borderRadius: '50%',
                                            padding: '8px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                            transition: 'transform 0.2s'
                                        }}
                                        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
                                        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        <Heart
                                            size={18}
                                            color="#ef4444"
                                            fill={isFavorite(item.id) ? "#ef4444" : "none"}
                                        />
                                    </button>
                                    {item.originalPrice && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '10px',
                                            left: '10px',
                                            background: '#ef4444',
                                            color: '#fff',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold'
                                        }}>
                                            Save {Math.round((1 - (['₹', '$', '€', '£'].some(s => item.price.startsWith(s)) ? parseFloat(item.price.slice(1)) : parseFloat(item.price)) / (['₹', '$', '€', '£'].some(s => item.originalPrice.startsWith(s)) ? parseFloat(item.originalPrice.slice(1)) : parseFloat(item.originalPrice))) * 100)}%
                                        </div>
                                    )}
                                </div>

                                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{
                                        fontSize: '0.8rem',
                                        color: 'var(--text-secondary)',
                                        marginBottom: '0.5rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>
                                        {item.category} • {item.seller}
                                    </div>
                                    <h3 style={{
                                        fontSize: '1.1rem',
                                        color: 'var(--text-color)',
                                        marginBottom: '0.5rem',
                                        fontWeight: 600,
                                        lineHeight: 1.4,
                                        flex: 1
                                    }}>
                                        {item.title}
                                    </h3>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', color: '#fbbf24' }}>
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} fill={i < Math.floor(item.rating) ? "#fbbf24" : "none"} strokeWidth={i < Math.floor(item.rating) ? 0 : 2} />
                                            ))}
                                        </div>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>({item.reviews})</span>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                                        <div>
                                            <span style={{ fontSize: '1.4rem', color: 'var(--text-color)', fontWeight: 700 }}>
                                                {['₹', '$', '€', '£'].some(s => item.price.startsWith(s)) ? item.price : `₹${item.price}`}
                                            </span>
                                            {item.originalPrice && (
                                                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textDecoration: 'line-through', marginLeft: '0.5rem' }}>
                                                    {item.originalPrice}
                                                </span>
                                            )}
                                        </div>
                                        {(() => {
                                            const cartItem = cartItems.find(c => c.id === item.id);
                                            const quantity = cartItem ? cartItem.quantity : 0;

                                            if (quantity > 0) {
                                                return (
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        background: '#4f46e5',
                                                        borderRadius: '8px',
                                                        overflow: 'hidden',
                                                        height: '36px'
                                                    }}>
                                                        <button
                                                            onClick={() => decreaseQuantity(item.id)}
                                                            style={{
                                                                background: 'transparent',
                                                                border: 'none',
                                                                color: '#fff',
                                                                width: '32px',
                                                                height: '100%',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                        >
                                                            <Minus size={16} />
                                                        </button>
                                                        <span style={{
                                                            color: '#fff',
                                                            fontWeight: 'bold',
                                                            fontSize: '0.9rem',
                                                            minWidth: '20px',
                                                            textAlign: 'center'
                                                        }}>
                                                            {quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => {
                                                                if (quantity >= (item.stock || 0)) {
                                                                    addToast("NO more items left in the stock!");
                                                                    return;
                                                                }
                                                                addToCart(item);
                                                            }}
                                                            style={{
                                                                background: 'transparent',
                                                                border: 'none',
                                                                color: '#fff',
                                                                width: '32px',
                                                                height: '100%',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                        >
                                                            <Plus size={16} />
                                                        </button>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <button
                                                    onClick={() => {
                                                        addToCart(item);
                                                        addToast(`${item.title} has been added to the cart!`);
                                                    }}
                                                    style={{
                                                        background: '#4f46e5',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        width: '36px',
                                                        height: '36px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#fff'
                                                    }}>
                                                    <ShoppingCart size={20} />
                                                </button>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default CategoryPage;
