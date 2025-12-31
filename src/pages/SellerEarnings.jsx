import React, { useMemo } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { DollarSign, Clock, ShoppingBag, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const SellerEarnings = () => {
    const { orders } = useMarketplace();
    const { user } = useAuth();

    // Filter orders for THIS seller only - ROBUST LOGIC
    const myOrders = useMemo(() => {
        return orders.filter(order => {
            return user && (
                (order.sellerEmail && order.sellerEmail === user.email) || // Exact match via Email
                (!order.sellerEmail && (order.sellerId === user.name || order.sellerId === user.storeName)) // Strict Fallback
            );
        });
    }, [orders, user]);

    const stats = useMemo(() => {
        const totalEarnings = myOrders
            .filter(o => o.status === 'Completed')
            .reduce((acc, curr) => acc + curr.amount, 0);

        const pendingEarnings = myOrders
            .filter(o => o.status === 'Pending')
            .reduce((acc, curr) => acc + curr.amount, 0);

        const totalOrders = myOrders.length;

        return { totalEarnings, pendingEarnings, totalOrders };
    }, [myOrders]);

    const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
                background: 'var(--card-bg)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '1.5rem',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                    padding: '10px',
                    borderRadius: '12px',
                    background: `rgba(${color}, 0.1)`,
                    color: `rgb(${color})`
                }}>
                    <Icon size={24} />
                </div>
                {subtext && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ArrowUpRight size={14} color="#10b981" />
                        12% vs last month
                    </span>
                )}
            </div>
            <div>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{title}</h3>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-color)' }}>{value}</div>
            </div>
        </motion.div>
    );

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '0.5rem'
                }}>
                    Earnings Dashboard
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>Track your sales and revenue.</p>
            </div>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
                marginBottom: '3rem'
            }}>
                <StatCard
                    title="Total Earnings"
                    value={`₹${stats.totalEarnings.toFixed(2)}`}
                    icon={DollarSign}
                    color="16, 185, 129" // Emerald
                    subtext={true}
                />
                <StatCard
                    title="Pending Earnings"
                    value={`₹${stats.pendingEarnings.toFixed(2)}`}
                    icon={Clock}
                    color="245, 158, 11" // Amber
                />
                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={ShoppingBag}
                    color="59, 130, 246" // Blue
                />
            </div>

            {/* Recent Transactions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                    background: 'var(--card-bg)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '24px',
                    border: '1px solid var(--border-color)',
                    padding: '1.5rem',
                    overflow: 'hidden'
                }}
            >
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--text-color)' }}>Recent Transactions</h2>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Product</th>
                                <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Date</th>
                                <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Buyer</th>
                                <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Amount</th>
                                <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myOrders.map((order) => (
                                <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '1rem', color: 'var(--text-color)', fontWeight: '500' }}>{order.product}</td>
                                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{order.date}</td>
                                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{order.buyer}</td>
                                    <td style={{ padding: '1rem', color: 'var(--text-color)', fontWeight: 'bold' }}>₹{order.amount.toFixed(2)}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '20px',
                                            fontSize: '0.85rem',
                                            fontWeight: '500',
                                            background: order.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                            color: order.status === 'Completed' ? '#10b981' : '#f59e0b',
                                            border: `1px solid ${order.status === 'Completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                                        }}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default SellerEarnings;
