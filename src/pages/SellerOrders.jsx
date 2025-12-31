import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Package, CheckCircle, Clock, Filter, Search, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const SellerOrders = () => {
    const { orders, updateOrderStatus } = useMarketplace();
    const { user } = useAuth();
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredOrders = orders.filter(order => {
        // Filter by Seller Identity (Email > Name > StoreName)
        const isMyOrder = user && (
            (order.sellerEmail && order.sellerEmail === user.email) || // Exact match via Email (New robust way)
            (order.sellerEmail && order.sellerEmail === user.email) || // Exact match via Email
            (!order.sellerEmail && (order.sellerId === user.name || order.sellerId === user.storeName)) // Strict Fallback (Name only)
        );
        if (!isMyOrder) return false;

        const matchesFilter = filter === 'All' || order.status === filter;
        const matchesSearch = order.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.buyer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const OrderCard = ({ order }) => (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
                background: 'var(--card-bg)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '1rem',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'var(--hover-bg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Package size={24} color="var(--primary-color)" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-color)', marginBottom: '4px' }}>{order.product}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Order ID: #{order.id} • {order.date}</p>

                        {/* New: Address & Payment Info */}
                        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'var(--hover-bg)', padding: '8px', borderRadius: '8px' }}>
                            <div style={{ marginBottom: '4px' }}>
                                <strong>Deliver To:</strong> {order.customerName} ({order.customerPhone})
                            </div>
                            <div style={{ marginBottom: '4px' }}>
                                {order.address}
                            </div>
                            <div>
                                <strong>Payment:</strong> {order.paymentMethod || 'Not Recorded'} {order.paymentId && order.paymentMethod === 'ONLINE' ? `(${order.paymentId})` : ''}
                            </div>
                        </div>

                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-color)', marginBottom: '4px' }}>₹{order.amount.toFixed(2)}</div>
                    <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        background: order.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: order.status === 'Completed' ? '#10b981' : '#f59e0b',
                        border: `1px solid ${order.status === 'Completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                    }}>
                        {order.status}
                    </span>
                </div>
            </div>

            <div style={{
                borderTop: '1px solid var(--border-color)',
                paddingTop: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                        color: '#fff',
                        fontSize: '0.7rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                    }}>
                        {order.buyer.charAt(0)}
                    </div>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{order.buyer}</span>
                </div>

                {order.status === 'Pending' && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => updateOrderStatus(order._id || order.id, 'Completed')}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '10px',
                            border: 'none',
                            background: 'var(--primary-color)',
                            color: '#fff',
                            fontWeight: '600',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        <CheckCircle size={14} />
                        Mark Completed
                    </motion.button>
                )}
            </div>
        </motion.div>
    );

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', paddingBottom: '80px' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginBottom: '0.5rem',
                    background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    Order Management
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>Manage and track your customer orders.</p>
            </div>

            {/* Filters & Search */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{
                    display: 'flex',
                    background: 'var(--card-bg)',
                    padding: '4px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)'
                }}>
                    {['All', 'Pending', 'Completed'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                border: 'none',
                                background: filter === tab ? 'var(--hover-bg)' : 'transparent',
                                color: filter === tab ? 'var(--text-color)' : 'var(--text-secondary)',
                                fontWeight: filter === tab ? '600' : '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontSize: '0.9rem'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div style={{
                    position: 'relative',
                    flex: 1,
                    maxWidth: '300px'
                }}>
                    <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        type="text"
                        placeholder="Search order or buyer..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.6rem 1rem 0.6rem 2.5rem',
                            borderRadius: '12px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--card-bg)',
                            color: 'var(--text-color)',
                            outline: 'none',
                            fontSize: '0.9rem'
                        }}
                    />
                </div>
            </div>

            {/* Orders List */}
            <div style={{ minHeight: '300px' }}>
                <AnimatePresence mode='popLayout'>
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map(order => (
                            <OrderCard key={order.id} order={order} />
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{
                                textAlign: 'center',
                                padding: '3rem',
                                color: 'var(--text-secondary)'
                            }}
                        >
                            <Package size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                            <p>No orders found matching your criteria.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SellerOrders;
