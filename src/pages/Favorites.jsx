import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
    const { user, toggleFavorite } = useAuth();
    const navigate = useNavigate();

    const favorites = user?.favorites || [];

    if (!user) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center', color: '#fff' }}>
                <h2>Please log in to view your favorites.</h2>
            </div>
        );
    }

    if (favorites.length === 0) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center', color: '#fff' }}>
                <Heart size={48} color="#ef4444" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <h2 style={{ marginBottom: '1rem' }}>No favorites yet</h2>
                <p style={{ color: '#a1a1aa', marginBottom: '2rem' }}>Start exploring and heart the items you love!</p>
                <button
                    onClick={() => navigate('/app')}
                    style={{
                        padding: '0.8rem 2rem',
                        background: 'var(--primary-color)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Browse Items
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#fff'
                    }}
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 style={{ fontSize: '2rem', color: '#fff', fontWeight: 'bold' }}>My Favorites</h1>
                <span style={{
                    background: 'rgba(255,255,255,0.1)',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    color: '#a1a1aa',
                    fontSize: '0.9rem'
                }}>
                    {favorites.length} items
                </span>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '2rem'
            }}>
                {favorites.map(item => (
                    <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ y: -8 }}
                        style={{
                            background: '#1e1e24',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            border: '1px solid rgba(255,255,255,0.05)',
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
                                    fill="#ef4444"
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
                                    Save {Math.round((1 - parseFloat(item.price.slice(1)) / parseFloat(item.originalPrice.slice(1))) * 100)}%
                                </div>
                            )}
                        </div>

                        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{
                                fontSize: '0.8rem',
                                color: '#a1a1aa',
                                marginBottom: '0.5rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}>
                                {item.category} • {item.seller}
                            </div>
                            <h3 style={{
                                fontSize: '1.1rem',
                                color: '#fff',
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
                                <span style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>({item.reviews})</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                                <div>
                                    <span style={{ fontSize: '1.4rem', color: '#fff', fontWeight: 700 }}>{item.price}</span>
                                    {item.originalPrice && (
                                        <span style={{ fontSize: '0.9rem', color: '#71717a', textDecoration: 'line-through', marginLeft: '0.5rem' }}>
                                            {item.originalPrice}
                                        </span>
                                    )}
                                </div>
                                <button style={{
                                    background: '#4f46e5',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff'
                                }}>
                                    <ShoppingCart size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Favorites;
