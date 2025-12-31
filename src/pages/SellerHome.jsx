import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Camera, Package, Zap, Heart, MessageCircle, Star, Bell, ArrowRight, Lightbulb, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AddProductModal from '../components/AddProductModal';
import AllActivityModal from '../components/AllActivityModal';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';

const SellerHome = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addProduct, orders, reels } = useMarketplace();
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const [greeting, setGreeting] = useState('');
    const [currentTip, setCurrentTip] = useState(0);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) setGreeting('Good Morning');
        else if (hour >= 12 && hour < 17) setGreeting('Good Afternoon');
        else if (hour >= 17 && hour < 21) setGreeting('Good Evening');
        else setGreeting('Good Night');

        const interval = setInterval(() => {
            setCurrentTip(prev => (prev + 1) % tips.length);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    // --- Dynamic Real-Time Activity Logic ---
    const activities = useMemo(() => {
        if (!user) return [];

        const myOrders = orders.filter(o =>
            (o.sellerEmail === user.email) ||
            (o.sellerId === user.name) ||
            (!o.sellerEmail && !o.sellerId) // Fallback for demo
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
                color: order.status === 'Completed' ? '#10b981' : '#f59e0b'
            });
        });

        // 2. Reel Activities
        myReels.forEach(reel => {
            activityList.push({
                type: 'reel',
                date: new Date(reel.createdAt || Date.now()), // Assuming createdAt exists, else fallback
                text: `Posted new reel: ${reel.caption ? reel.caption.substring(0, 20) : 'Untitled'}...`,
                subtext: `${reel.views || 0} views`,
                icon: Video,
                color: '#ec4899'
            });
        });

        // Sort by date descending (newest first)
        return activityList.sort((a, b) => b.date - a.date).slice(0, 10); // Show top 10
    }, [orders, reels, user]);

    // Helper for "Time Ago"
    const getTimeAgo = (date) => {
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
    };

    const tips = [
        "Posting reels between 6PM and 9PM gets 40% more engagement.",
        "Quality photos increase sales probability by 3x.",
        "Reply to comments within 1 hour to boost your store ranking.",
        "Add #UniXchange to your posts to get featured."
    ];

    const actions = [
        {
            title: "Post Item",
            icon: Package,
            color: "#8b5cf6",
            bgColor: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
            desc: "List a product",
            onClick: () => setIsProductModalOpen(true)
        },
        {
            title: "Reel Studio",
            icon: Video,
            color: "#ec4899",
            bgColor: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
            desc: "Boost sales",
            onClick: () => navigate('/app/reel-studio')
        },
        {
            title: "Insights",
            icon: Zap,
            color: "#f59e0b",
            bgColor: "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)",
            desc: "View analytics",
            onClick: () => navigate('/app/analytics')
        }
    ];

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', color: 'var(--text-color)' }}>

            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
            >
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        {greeting}, {user?.storeName || 'Seller'}!
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        Your store is <span style={{ color: '#10b981', fontWeight: 'bold' }}>Active</span> and ready for business.
                    </p>
                </div>
                <div style={{ textAlign: 'right', display: 'none', md: 'block' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Store Rating</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '1.5rem', fontWeight: 'bold' }}>
                        4.9 <Star size={20} fill="#f59e0b" color="#f59e0b" />
                    </div>
                </div>
            </motion.div>

            {/* Main Grid Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>

                {/* Left Column: Actions & Tips */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Quick Actions (Creative Cards) */}
                    <div>
                        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 600 }}>Quick Actions</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                            {actions.map((action, index) => (
                                <motion.button
                                    key={index}
                                    onClick={action.onClick}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        background: action.bgColor,
                                        border: 'none',
                                        borderRadius: '20px',
                                        padding: '1.5rem 1rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.8rem',
                                        cursor: 'pointer',
                                        color: '#fff',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                        height: '160px'
                                    }}
                                >
                                    <div style={{
                                        background: 'rgba(255,255,255,0.2)',
                                        padding: '12px',
                                        borderRadius: '50%',
                                        backdropFilter: 'blur(5px)'
                                    }}>
                                        <action.icon size={24} color="#fff" />
                                    </div>
                                    <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>{action.title}</span>
                                    <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>{action.desc}</span>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Rotating Tips Widget */}
                    <div style={{
                        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                        borderRadius: '20px',
                        padding: '1.5rem',
                        border: '1px solid #334155',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ position: 'absolute', top: -10, right: -10, opacity: 0.1 }}>
                            <Lightbulb size={120} color="#fff" />
                        </div>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', fontWeight: 'bold', marginBottom: '1rem' }}>
                            <Lightbulb size={20} /> Seller Tip
                        </h3>
                        <div style={{ minHeight: '60px' }}>
                            <AnimatePresence mode='wait'>
                                <motion.p
                                    key={currentTip}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    style={{ fontSize: '1.1rem', lineHeight: '1.5', color: '#e2e8f0' }}
                                >
                                    "{tips[currentTip]}"
                                </motion.p>
                            </AnimatePresence>
                        </div>
                        <div style={{ display: 'flex', gap: '5px', marginTop: '1rem' }}>
                            {tips.map((_, i) => (
                                <div key={i} style={{
                                    width: i === currentTip ? '20px' : '6px',
                                    height: '6px',
                                    borderRadius: '3px',
                                    background: i === currentTip ? '#f59e0b' : '#475569',
                                    transition: 'all 0.3s'
                                }} />
                            ))}
                        </div>
                    </div>

                </div>

                {/* Right Column: Activity Feed */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Live Activity</h2>
                        {activities.length > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: '#10b981' }}>
                                <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', display: 'inline-block' }}></span>
                                Real-time
                            </div>
                        )}
                    </div>

                    <div style={{
                        background: 'var(--card-bg)',
                        borderRadius: '24px',
                        padding: '1.5rem',
                        border: '1px solid var(--border-color)',
                        height: '100%',
                        maxHeight: '450px',
                        overflowY: 'auto'
                    }}>
                        {activities.length === 0 ? (
                            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                                <Bell size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                <p>No recent activity.</p>
                                <p style={{ fontSize: '0.9rem' }}>Post a reel or product to get started!</p>
                            </div>
                        ) : (
                            activities.map((activity, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        gap: '1rem',
                                        padding: '1rem 0',
                                        borderBottom: index !== activities.length - 1 ? '1px solid var(--border-color)' : 'none'
                                    }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '12px',
                                            background: `${activity.color}15`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            <activity.icon size={20} color={activity.color} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '0.95rem', marginBottom: '0.2rem', fontWeight: 500 }}>{activity.text}</p>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{activity.subtext}</p>
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'flex-end',
                                            justifyContent: 'center',
                                            minWidth: '70px'
                                        }}>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{getTimeAgo(activity.date)}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}

                        <div
                            onClick={() => setIsActivityModalOpen(true)}
                            style={{
                                marginTop: '1.5rem',
                                textAlign: 'center',
                                padding: '1rem',
                                background: 'var(--hover-bg)',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                color: 'var(--text-secondary)',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.background = 'var(--bg-secondary)'}
                            onMouseLeave={(e) => e.target.style.background = 'var(--hover-bg)'}
                        >
                            View All Activity
                        </div>
                    </div>
                </div>

            </div>

            <AddProductModal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                onSave={addProduct}
            />

            <AllActivityModal
                isOpen={isActivityModalOpen}
                onClose={() => setIsActivityModalOpen(false)}
            />
        </div>
    );
};

export default SellerHome;
