import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, MessageCircle, Star, Bell, ShoppingBag, DollarSign, User, Video } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';

const AllActivityModal = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const { orders, reels } = useMarketplace();

    // --- Dynamic Real-Time Activity Logic (Mirrored from SellerHome) ---
    const allActivities = useMemo(() => {
        if (!user) return [];

        const myOrders = orders.filter(o =>
            (o.sellerEmail === user.email) ||
            (o.sellerId === user.name) ||
            (!o.sellerEmail && !o.sellerId)
        );

        const myReels = reels.filter(r =>
            r.user?.userId === user.id ||
            r.user?.email === user.email
        );

        const activityList = [];

        // 1. Order Activities
        myOrders.forEach(order => {
            activityList.push({
                type: 'order',
                date: new Date(order.date || Date.now()),
                text: `New order for '${order.product}'`,
                subtext: `Amount: ₹${order.amount} • ${order.status}`,
                icon: ShoppingBag,
                color: order.status === 'Completed' ? '#10b981' : '#f59e0b',
                time: getTimeAgo(new Date(order.date || Date.now()))
            });
        });

        // 2. Reel Activities
        myReels.forEach(reel => {
            activityList.push({
                type: 'reel',
                date: new Date(reel.createdAt || Date.now()),
                text: `Posted new reel: ${reel.caption ? reel.caption.substring(0, 30) : 'Untitled'}...`,
                subtext: `${reel.views || 0} views • ${reel.likes || 0} likes`,
                icon: Video,
                color: '#ec4899',
                time: getTimeAgo(new Date(reel.createdAt || Date.now()))
            });
        });

        // Sort by date descending (newest first)
        return activityList.sort((a, b) => b.date - a.date);
    }, [orders, reels, user]);

    function getTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " mins ago";
        return "Just now";
    }

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
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
                            background: 'rgba(0, 0, 0, 0.7)',
                            backdropFilter: 'blur(5px)',
                            zIndex: 1000,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: 'var(--card-bg)',
                                width: '90%',
                                maxWidth: '600px',
                                maxHeight: '80vh',
                                borderRadius: '24px',
                                border: '1px solid var(--border-color)',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                            }}
                        >
                            {/* Header */}
                            <div style={{
                                padding: '1.5rem',
                                borderBottom: '1px solid var(--border-color)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Bell size={24} color="var(--primary-color)" />
                                    Activity Feed
                                </h2>
                                <button
                                    onClick={onClose}
                                    style={{
                                        background: 'var(--hover-bg)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '36px',
                                        height: '36px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        color: 'var(--text-secondary)'
                                    }}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* List */}
                            <div style={{
                                padding: '1rem',
                                overflowY: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem'
                            }}>
                                {allActivities.length === 0 ? (
                                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                                        <Bell size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                        <p>No activity found.</p>
                                    </div>
                                ) : (
                                    allActivities.map((activity, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            style={{
                                                display: 'flex',
                                                gap: '1rem',
                                                padding: '1rem',
                                                borderRadius: '16px',
                                                background: 'var(--hover-bg)',
                                                alignItems: 'center',
                                                transition: 'transform 0.2s',
                                                cursor: 'default'
                                            }}
                                            whileHover={{ scale: 1.01, background: 'var(--bg-secondary)' }}
                                        >
                                            <div style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '14px',
                                                background: `${activity.color}15`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            }}>
                                                <activity.icon size={24} color={activity.color} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '0.2rem', color: 'var(--text-color)' }}>{activity.text}</p>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                    {activity.subtext} • <span style={{ color: 'var(--text-secondary)', opacity: 0.8 }}>{activity.time}</span>
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            <div style={{
                                padding: '1rem',
                                borderTop: '1px solid var(--border-color)',
                                textAlign: 'center',
                                fontSize: '0.9rem',
                                color: 'var(--text-secondary)'
                            }}>
                                Showing all {allActivities.length} activities
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AllActivityModal;
