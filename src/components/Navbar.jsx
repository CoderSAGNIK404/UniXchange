import React, { useState } from 'react';
import { Search, User, ShoppingBag, LogOut, Home, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import BankDetailsModal from './BankDetailsModal';

const Navbar = ({ userType, toggleUserType, searchQuery, setSearchQuery, searchFilter, setSearchFilter }) => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [showBankModal, setShowBankModal] = useState(false);

    return (
        <>
            <nav style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 2rem',
                background: 'var(--card-bg)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid var(--border-color)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                gap: '2rem'
            }}>
                {/* Left Section: Logo */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        margin: 0
                    }}>
                        UniXchange
                    </h2>
                </div>

                {/* Center Section: Search Bar */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'var(--hover-bg)',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        border: '1px solid var(--border-color)',
                        width: '100%',
                        maxWidth: '400px'
                    }}>
                        <select
                            value={searchFilter}
                            onChange={(e) => setSearchFilter(e.target.value)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                borderRight: '1px solid var(--border-color)',
                                color: 'var(--text-secondary)',
                                marginRight: '0.5rem',
                                outline: 'none',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                paddingRight: '0.5rem'
                            }}
                        >
                            <option value="All" style={{ background: 'var(--card-bg)' }}>All</option>
                            <option value="Products" style={{ background: 'var(--card-bg)' }}>Products</option>
                            <option value="Reels" style={{ background: 'var(--card-bg)' }}>Reels</option>
                            <option value="Textbooks" style={{ background: 'var(--card-bg)' }}>Textbooks</option>
                            <option value="Electronics" style={{ background: 'var(--card-bg)' }}>Electronics</option>
                            <option value="Clothing" style={{ background: 'var(--card-bg)' }}>Clothing</option>
                            <option value="Stationery" style={{ background: 'var(--card-bg)' }}>Stationery</option>
                        </select>

                        <Search size={18} color="var(--text-secondary)" />
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-color)',
                                marginLeft: '0.5rem',
                                outline: 'none',
                                width: '100%'
                            }}
                        />
                    </div>
                </div>

                {/* Right Section: Actions */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '2rem' }}>
                    {userType === 'buyer' ? (
                        <>
                            <motion.div
                                onClick={() => navigate('/app')}
                                whileHover={{ scale: 1.05, boxShadow: '0 6px 20px rgba(var(--primary-rgb), 0.3)' }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.6rem 1.2rem',
                                    background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    color: '#fff',
                                    fontWeight: '600',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }}
                            >
                                <Home size={18} />
                                <span>Home</span>
                            </motion.div>

                            <div
                                style={{ position: 'relative', cursor: 'pointer', marginLeft: '0.5rem' }}
                                onClick={() => navigate('/app/cart')}
                            >
                                <div style={{
                                    padding: '10px',
                                    background: 'var(--hover-bg)',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border-color)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <ShoppingBag size={20} color="var(--text-color)" />
                                </div>
                                {cartCount > 0 && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        style={{
                                            position: 'absolute',
                                            top: '-5px',
                                            right: '-5px',
                                            background: '#ef4444',
                                            color: 'white',
                                            borderRadius: '50%',
                                            width: '20px',
                                            height: '20px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            border: '2px solid var(--card-bg)'
                                        }}
                                    >
                                        {cartCount}
                                    </motion.div>
                                )}
                            </div>

                        </>
                    ) : (
                        <>
                            <div onClick={() => navigate('/app')} style={{
                                background: 'linear-gradient(to right, #FFD700, #FDB931, #FFD700)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textShadow: '0px 2px 4px rgba(0,0,0,0.3)',
                                fontWeight: '800',
                                fontSize: '1.05rem',
                                cursor: 'pointer',
                                textDecoration: 'none',
                                whiteSpace: 'nowrap'
                            }}>
                                {user?.storeName || 'Dashboard'}
                            </div>
                            <div onClick={() => navigate('/app/products')} style={{ color: 'var(--text-color)', textDecoration: 'none', opacity: 0.8, cursor: 'pointer', whiteSpace: 'nowrap' }}>Inventory</div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowBankModal(true)}
                                style={{
                                    background: 'rgba(16, 185, 129, 0.15)',
                                    color: '#10b981',
                                    border: '1px solid rgba(16, 185, 129, 0.3)',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontWeight: '600',
                                    fontSize: '0.9rem'
                                }}
                            >
                                <CreditCard size={16} />
                                Bank Details
                            </motion.button>
                        </>
                    )}

                    <div
                        onClick={toggleUserType}
                        style={{
                            width: '80px',
                            height: '32px',
                            background: 'var(--hover-bg)',
                            borderRadius: '30px',
                            padding: '4px', // Slightly increased padding for safety
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: userType === 'buyer' ? 'flex-start' : 'flex-end', // Use flex alignment
                            position: 'relative',
                            boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.1), 0 1px 0 var(--border-color)',
                            border: '1px solid var(--border-color)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {/* Background Icons/Text hints */}
                        <div style={{
                            position: 'absolute',
                            left: '8px',
                            opacity: userType === 'seller' ? 1 : 0.4,
                            transition: 'opacity 0.3s'
                        }}>
                            <ShoppingBag size={14} color="var(--primary-color)" />
                        </div>
                        <div style={{
                            position: 'absolute',
                            right: '8px',
                            opacity: userType === 'buyer' ? 1 : 0.4,
                            transition: 'opacity 0.3s'
                        }}>
                            <User size={14} color="var(--primary-color)" />
                        </div>

                        {/* Moving Knob */}
                        <motion.div
                            layout
                            transition={{ type: "spring", stiffness: 700, damping: 30 }}
                            style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                background: 'linear-gradient(180deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 2
                            }}
                        >
                            {userType === 'buyer' ?
                                <ShoppingBag size={12} color="#fff" /> :
                                <User size={12} color="#fff" />
                            }
                        </motion.div>
                    </div>

                    {/* Profile Section */}
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div
                                onClick={() => navigate('/app/profile')}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '1.2rem',
                                    color: '#fff',
                                    border: '2px solid var(--border-color)',
                                    cursor: 'pointer',
                                    overflow: 'hidden'
                                }}
                            >
                                {user.photoUrl ? (
                                    <img src={user.photoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    user.name ? user.name.charAt(0).toUpperCase() : 'U'
                                )}
                            </div>
                            <button
                                onClick={() => {
                                    logout();
                                    navigate('/auth');
                                }}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--text-secondary)',
                                    transition: 'color 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                                onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => navigate('/auth')}
                            style={{
                                padding: '0.5rem 1.5rem',
                                background: 'var(--hover-bg)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '20px',
                                color: 'var(--text-color)',
                                cursor: 'pointer',
                                fontWeight: 500,
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.background = 'var(--border-color)'}
                            onMouseLeave={(e) => e.target.style.background = 'var(--hover-bg)'}
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </nav>
            <BankDetailsModal isOpen={showBankModal} onClose={() => setShowBankModal(false)} />
        </>
    );
};

export default Navbar;
