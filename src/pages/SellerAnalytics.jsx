import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, DollarSign, ShoppingBag, TrendingUp, ArrowUpRight, ArrowDownRight, Calendar, Filter, Clock } from 'lucide-react';

import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';

const SellerAnalytics = () => {
    const [timeRange, setTimeRange] = useState('7d');
    const { user } = useAuth();
    const { orders } = useMarketplace();

    // Filter orders for THIS seller only
    const myOrders = orders.filter(order => {
        return user && (
            (order.sellerEmail && order.sellerEmail === user.email) || // Exact match via Email
            (!order.sellerEmail && (order.sellerId === user.name || order.sellerId === user.storeName)) // Strict Fallback (Name only)
        );
    });

    // Calculate Real Stats based on myOrders
    const totalRevenue = myOrders.reduce((acc, order) => {
        // Realized Revenue: Only Completed orders count as money in the bonk
        if (order.status === 'Completed') {
            return acc + Number(order.amount);
        }
        return acc;
    }, 0);

    const pendingRevenue = myOrders.reduce((acc, order) => {
        // Pending Revenue: Money waiting to be realized
        if (order.status === 'Pending') {
            return acc + Number(order.amount);
        }
        return acc;
    }, 0);

    const totalOrders = myOrders.length;
    const avgOrderValue = totalOrders > 0 ? Math.round((totalRevenue + pendingRevenue) / totalOrders) : 0;

    const stats = [
        { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, change: "Realized", isPositive: true, icon: DollarSign, color: "#10b981" },
        { label: "Pending Earnings", value: `₹${pendingRevenue.toLocaleString()}`, change: "Potential", isPositive: true, icon: Clock, color: "#f59e0b" },
        { label: "Total Orders", value: totalOrders, change: "All Time", isPositive: true, icon: ShoppingBag, color: "#3b82f6" },
        { label: "Avg. Order Value", value: `₹${avgOrderValue}`, change: "Est.", isPositive: totalOrders > 0, icon: BarChart2, color: "#8b5cf6" },
    ];

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', color: 'var(--text-color)' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Sales Analytics</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Track your earnings and performance.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            style={{
                                padding: '0.6rem 1rem',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--card-bg)',
                                color: 'var(--text-color)',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                            <option value="90d">Last 3 Months</option>
                        </select>
                        <button style={{
                            padding: '0.6rem',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--card-bg)',
                            color: 'var(--text-color)',
                            cursor: 'pointer'
                        }}>
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    {stats.map((stat, index) => (
                        <div key={index} style={{
                            background: 'var(--card-bg)',
                            padding: '1.5rem',
                            borderRadius: '16px',
                            border: '1px solid var(--border-color)',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div style={{
                                    padding: '10px',
                                    borderRadius: '12px',
                                    background: `${stat.color}20`
                                }}>
                                    <stat.icon size={24} color={stat.color} />
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '0.85rem',
                                    color: stat.isPositive ? '#10b981' : '#ef4444',
                                    fontWeight: 600
                                }}>
                                    {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {stat.change}
                                </div>
                            </div>
                            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>{stat.label}</h3>
                            <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{stat.value}</div>
                        </div>
                    ))}
                </div>

                {/* Pending Orders Section */}
                {/* Only show if there are pending orders */}
                {myOrders.filter(o => o.status === 'Pending').length > 0 && (
                    <div style={{
                        background: 'var(--card-bg)',
                        padding: '1.5rem',
                        borderRadius: '16px',
                        border: '1px solid var(--border-color)',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                        marginBottom: '2rem'
                    }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <ShoppingBag size={20} /> Pending Orders (Action Required)
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {myOrders.filter(o => o.status === 'Pending').map((order) => (
                                <OrderCard key={order._id || order.id} order={order} isPending={true} />
                            ))}
                        </div>
                    </div>
                )}


                {/* Recent Transactions (History) */}
                <div style={{
                    background: 'var(--card-bg)',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Order History</h3>
                        <button style={{ color: 'var(--primary-color)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View All</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {myOrders.filter(o => o.status !== 'Pending').length === 0 ? (
                            <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No completed orders history.</p>
                        ) : (
                            myOrders.filter(o => o.status !== 'Pending').slice(0, 5).map((order) => (
                                <OrderCard key={order._id || order.id} order={order} />
                            ))
                        )}
                    </div>
                </div>

            </motion.div>
        </div>
    );
};

const OrderCard = ({ order, isPending }) => {
    const { updateOrderStatus } = useMarketplace();

    // Normalize ID
    const displayId = order._id ? `#${order._id.slice(-6)}` : '#ORD-NEW';
    const dateStr = new Date(order.date).toLocaleDateString();

    const handleMarkShipped = () => {
        // Assuming updateOrderStatus updates the context AND potentially calls backend
        // We'll trust the context implementation for now
        updateOrderStatus(order._id || order.id, 'Completed');
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--border-color)'
        }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                <div style={{
                    background: 'var(--hover-bg)',
                    padding: '8px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '40px', width: '40px'
                }}>
                    <ShoppingBag size={18} color="var(--primary-color)" />
                </div>
                <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{order.product}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{dateStr} • {displayId}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-color)', marginTop: '4px' }}>
                        <span style={{ fontWeight: 500 }}>To: </span>{order.customerName || 'Guest'} {order.customerPhone && <span style={{ color: 'var(--text-secondary)' }}>({order.customerPhone})</span>}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '300px', lineHeight: '1.2' }}>
                        {order.address || 'No address provided'}
                    </div>
                </div>
            </div>

            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <div style={{ fontWeight: 'bold' }}>₹{order.amount}</div>
                {isPending ? (
                    <button
                        onClick={handleMarkShipped}
                        style={{
                            background: '#10b981',
                            color: '#fff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: 600
                        }}
                    >
                        Mark Shipped
                    </button>
                ) : (
                    <div style={{
                        fontSize: '0.75rem',
                        color: order.status === 'Completed' ? '#10b981' : order.status === 'Cancelled' ? '#ef4444' : '#f59e0b',
                        background: order.status === 'Completed' ? '#10b98120' : order.status === 'Cancelled' ? '#ef444420' : '#f59e0b20',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        display: 'inline-block'
                    }}>
                        {order.status}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerAnalytics;
