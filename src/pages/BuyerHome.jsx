import React from 'react';
import { Heart, ShoppingCart, Star, Plus, Minus } from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import ProductDetailModal from '../components/ProductDetailModal';

const categories = [
    { name: "Textbooks", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80" },
    { name: "Clothing", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=300&q=80" },
    { name: "Electronics", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=300&q=80" },
    { name: "Stationery", image: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=300&q=80" },
    { name: "Dorm Essentials", image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=300&q=80" }
];

const BuyerHome = () => {
    const { searchQuery } = useOutletContext();
    const navigate = useNavigate(); // Add hook
    const { user, toggleFavorite } = useAuth();
    const { products } = useMarketplace();
    const { cartItems, addToCart, decreaseQuantity } = useCart();

    const { addToast } = useToast();
    const [selectedProduct, setSelectedProduct] = React.useState(null);

    // ... (rest of component) ...
    // Note: I will update the button onClick separately or inline it if simple.
    // Wait, I should do the onClick update in a separate call if I can't reach it easily here
    // or better, I'll update lines 18-20 and then the button below.

    const filteredItems = products.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isFavorite = (itemId) => {
        return user?.favorites?.some(fav => fav.id === itemId);
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Hero Banner */}
            <div style={{
                background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)',
                borderRadius: '20px',
                padding: '3rem',
                marginBottom: '3rem',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{ zIndex: 1, color: '#fff', maxWidth: '600px' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', lineHeight: 1.2 }}>
                        Student Marketplace <br />
                        <span style={{ color: '#fbbf24' }}>Made Simple.</span>
                    </h1>
                    <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '2rem' }}>
                        Buy and sell textbooks, electronics, and dorm essentials within your campus community.
                    </p>

                </div>
                {/* Abstract Shapes/Decorations could go here */}
                <div style={{
                    position: 'absolute',
                    right: '-50px',
                    top: '-50px',
                    width: '400px',
                    height: '400px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    filter: 'blur(50px)'
                }} />
            </div>

            {/* Categories */}
            <h2 style={{ fontSize: '1.8rem', color: 'var(--text-color)', marginBottom: '1.5rem', fontWeight: 600 }}>Shop by Category</h2>
            <div style={{
                display: 'flex',
                gap: '1.5rem',
                overflowX: 'auto',
                paddingBottom: '1rem',
                marginBottom: '3rem',
                scrollbarWidth: 'none'
            }}>
                {categories.map((cat, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/app/category/${cat.name}`)}
                        style={{
                            minWidth: '160px',
                            height: '200px',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            position: 'relative',
                            cursor: 'pointer',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                        }}
                    >
                        <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: '1rem',
                            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                            color: '#fff',
                            fontWeight: 'bold',
                            textAlign: 'center'
                        }}>
                            {cat.name}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Featured Items */}
            <h2 style={{ fontSize: '1.8rem', color: 'var(--text-color)', marginBottom: '1.5rem', fontWeight: 600 }}>Fresh Finds</h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '2rem'
            }}>
                {filteredItems.map(item => (
                    <motion.div
                        key={item.id}
                        layoutId={`product-${item.id}`}
                        onClick={() => setSelectedProduct(item)}
                        whileHover={{ y: -8 }}
                        style={{
                            background: 'var(--card-bg)',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            flexDirection: 'column',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                            <motion.img
                                layoutId={`image-${item.id}`}
                                src={item.image}
                                alt={item.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent card click
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
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        decreaseQuantity(item.id);
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
                                                    onClick={(e) => {
                                                        e.stopPropagation();
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
                                            onClick={(e) => {
                                                e.stopPropagation();
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


            <ProductDetailModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </div >
    );
};

export default BuyerHome;
