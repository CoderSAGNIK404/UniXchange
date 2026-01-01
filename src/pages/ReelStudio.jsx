import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Play, Video, Rocket, Target, CreditCard, CheckCircle, TrendingUp, Smartphone, ShieldCheck, Loader2, AlertTriangle, Trash2, Plus, BarChart2, Clock } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';
import { initializePayment } from '../utils/paymentService';

const ReelStudio = () => {
    const { reels, orders, deleteReel, addReel } = useMarketplace();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'upload' | 'promote'
    const [showBoostModal, setShowBoostModal] = useState(false);
    const [selectedReelForBoost, setSelectedReelForBoost] = useState(null);

    // Filter reels for the current user
    const myReels = user ? reels.filter(r => r.user?.userId === user.id) : reels;

    return (
        <div style={{
            padding: '2rem',
            maxWidth: '1200px',
            margin: '0 auto',
            minHeight: '100vh',
            color: 'var(--text-color)'
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', background: 'linear-gradient(to right, #fff, #9ca3af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Reel Studio
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage, upload, and boost your content</p>
                </div>
                <button
                    onClick={() => setActiveTab('upload')}
                    style={{
                        background: 'linear-gradient(45deg, #7c3aed, #ec4899)',
                        color: 'white',
                        border: 'none',
                        padding: '0.8rem 1.5rem',
                        borderRadius: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)'
                    }}
                >
                    <Plus size={20} /> New Reel
                </button>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1px' }}>
                <TabButton active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={BarChart2} label="Analytics" />
                <TabButton active={activeTab === 'upload'} onClick={() => setActiveTab('upload')} icon={Upload} label="Upload" />
                {/* Promote tab is hidden, accessed via actions */}
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
                {activeTab === 'analytics' && (
                    <motion.div
                        key="analytics"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <AnalyticsView
                            reels={myReels}
                            orders={orders}
                            onDelete={(id) => deleteReel(id, user?.id)}
                            onBoost={(reel) => {
                                setSelectedReelForBoost(reel);
                                setShowBoostModal(true);
                            }}
                        />
                    </motion.div>
                )}

                {activeTab === 'upload' && (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <UploadView onUploadComplete={() => setActiveTab('analytics')} addReel={addReel} user={user} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Boost Modal */}
            {showBoostModal && (
                <BoostModal
                    reel={selectedReelForBoost}
                    onClose={() => setShowBoostModal(false)}
                />
            )}
        </div>
    );
};

// --- Sub-components ---

const TabButton = ({ active, onClick, icon: Icon, label }) => (
    <button
        onClick={onClick}
        style={{
            background: 'none',
            border: 'none',
            padding: '1rem 1.5rem',
            color: active ? '#7c3aed' : 'var(--text-secondary)',
            borderBottom: active ? '2px solid #7c3aed' : '2px solid transparent',
            cursor: 'pointer',
            fontWeight: active ? 'bold' : 'normal',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s',
            marginBottom: '-2px'
        }}
    >
        <Icon size={18} /> {label}
    </button>
);

const UploadView = ({ onUploadComplete, addReel, user }) => {
    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState('');
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected && selected.type.startsWith('video/')) {
            setFile(selected);
            setPreviewUrl(URL.createObjectURL(selected));
        } else {
            alert('Please select a valid video file');
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const selected = e.dataTransfer.files[0];
        if (selected && selected.type.startsWith('video/')) {
            setFile(selected);
            setPreviewUrl(URL.createObjectURL(selected));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !caption) return;

        setLoading(true);

        const formData = new FormData();
        formData.append('video', file);
        formData.append('caption', caption);
        if (user) {
            formData.append('userId', user.id);
            formData.append('userName', user.name);
            formData.append('storeName', user.storeName);
            formData.append('userAvatar', user.avatar);
        }

        try {
            const res = await fetch('/api/reels', {
                method: 'POST',
                body: formData // No Content-Type header needed, browser sets it for FormData
            });

            if (res.ok) {
                const newReel = await res.json();
                addReel(newReel);
                setLoading(false);
                onUploadComplete();
            } else {
                const error = await res.json();
                alert(`Upload failed: ${error.message}`);
                setLoading(false);
            }
        } catch (err) {
            console.error("Upload error:", err);
            alert("Failed to connect to server. Ensure backend is running.");
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                    border: '2px dashed var(--border-color)',
                    borderRadius: '16px',
                    padding: '3rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: 'var(--card-bg)',
                    marginBottom: '2rem',
                    transition: 'border-color 0.2s'
                }}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="video/*"
                    style={{ display: 'none' }}
                />

                {previewUrl ? (
                    <div style={{ position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
                        <video src={previewUrl} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} controls />
                        <button
                            onClick={(e) => { e.stopPropagation(); setFile(null); setPreviewUrl(null); }}
                            style={{
                                position: 'absolute', top: 10, right: 10,
                                background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff',
                                borderRadius: '50%', padding: '5px', cursor: 'pointer'
                            }}
                        >
                            <X size={20} />
                        </button>
                    </div>
                ) : (
                    <>
                        <div style={{
                            width: '64px', height: '64px', background: 'rgba(124, 58, 237, 0.1)',
                            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 1rem'
                        }}>
                            <Upload size={32} color="#7c3aed" />
                        </div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Upload your reel</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Drag and drop or click to browse</p>
                    </>
                )}
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Caption</label>
                <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Write a catchy caption about your product..."
                    style={{
                        width: '100%',
                        padding: '1rem',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--card-bg)',
                        color: 'var(--text-color)',
                        minHeight: '100px',
                        outline: 'none',
                        resize: 'none'
                    }}
                />
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading || !file || !caption}
                style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: 'none',
                    background: loading ? 'var(--text-secondary)' : '#7c3aed',
                    color: 'white',
                    fontWeight: 'bold',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                }}
            >
                {loading ? <Loader2 className="animate-spin" /> : <Rocket />}
                {loading ? 'Posting...' : 'Post Reel'}
            </button>
        </div>
    );
};

const AnalyticsView = ({ reels, orders, onDelete, onBoost }) => {
    if (reels.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <Video size={48} style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }} />
                <h3>No reels yet</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Upload your first reel to start tracking analytics!</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {reels.map((reel) => {
                const reelOrders = orders.filter(o =>
                    o.sourceReelId === (reel.id ? reel.id.toString() : reel._id) &&
                    o.status === 'Completed' // Only count completed orders as realized revenue
                );
                const revenue = reelOrders.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
                const views = reel.views || 0;
                const likes = reel.likes?.length || 0;

                return (
                    <div key={reel._id} style={{
                        background: 'var(--card-bg)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: '1px solid var(--border-color)',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ position: 'relative', height: '180px' }}>
                            <video src={reel.videoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent, rgba(0,0,0,0.8))',
                                display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '10px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => onBoost(reel)}
                                        style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', border: 'none', borderRadius: '50%', padding: '6px', cursor: 'pointer', color: '#fff' }}
                                        title="Boost Reel"
                                    >
                                        <Rocket size={16} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Delete this reel?')) onDelete(reel._id);
                                        }}
                                        style={{ background: 'rgba(239, 68, 68, 0.4)', backdropFilter: 'blur(4px)', border: 'none', borderRadius: '50%', padding: '6px', cursor: 'pointer', color: '#fff' }}
                                        title="Delete Reel"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>{reel.caption}</div>
                            </div>
                        </div>

                        <div style={{ padding: '1rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <StatItem icon={Play} label="Views" value={views} color="#3b82f6" />
                                <StatItem icon={TrendingUp} label="Revenue" value={`₹${revenue}`} color="#10b981" />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const StatItem = ({ icon: Icon, label, value, color }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <div style={{ padding: '8px', borderRadius: '8px', background: `${color}20` }}>
            <Icon size={18} color={color} />
        </div>
        <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{label}</div>
            <div style={{ fontWeight: 'bold' }}>{value}</div>
        </div>
    </div>
);

const BOOST_PLANS = [
    { price: 99, days: 3, reach: '1.2k - 2.5k', label: 'Starter' },
    { price: 299, days: 7, reach: '5k - 8k', label: 'Popular' },
    { price: 499, days: 15, reach: '12k - 18k', label: 'Pro' }
];

const BoostModal = ({ reel, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(BOOST_PLANS[0]);

    const handlePayment = () => {
        setLoading(true);

        initializePayment(
            selectedPlan.price,
            (response) => {
                // Success Callback
                setLoading(false);
                alert(`Boost Activated for ${selectedPlan.days} days! Payment ID: ${response.razorpay_payment_id}`);
                // TODO: Call backend to store promotion details
                onClose();
            },
            (error) => {
                setLoading(false);
                alert('Payment Failed or Cancelled');
            },
            `Boost: ${selectedPlan.label} (${selectedPlan.days} Days)`
        );
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div style={{
                background: '#1a1a1a', padding: '2rem', borderRadius: '24px',
                width: '90%', maxWidth: '500px', border: '1px solid var(--border-color)',
                position: 'relative'
            }}>
                <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <X size={24} />
                </button>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '60px', height: '60px', background: 'linear-gradient(45deg, #7c3aed, #ec4899)', borderRadius: '50%', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Rocket size={32} color="white" />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Boost Your Reel</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Choose a plan to reach more customers</p>
                </div>

                <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {BOOST_PLANS.map((plan) => (
                        <div
                            key={plan.price}
                            onClick={() => setSelectedPlan(plan)}
                            style={{
                                padding: '1.2rem',
                                border: selectedPlan.price === plan.price ? '2px solid #7c3aed' : '1px solid #333',
                                borderRadius: '16px',
                                background: selectedPlan.price === plan.price ? 'rgba(124, 58, 237, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                transition: 'all 0.2s',
                                position: 'relative'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '24px', height: '24px', borderRadius: '50%',
                                    border: selectedPlan.price === plan.price ? '6px solid #7c3aed' : '2px solid #666',
                                    background: 'transparent',
                                    transition: 'all 0.2s'
                                }}></div>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {plan.label}
                                        {plan.label === 'Popular' && <span style={{ fontSize: '0.7rem', background: '#ec4899', padding: '2px 6px', borderRadius: '4px' }}>HOT</span>}
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                        {plan.days} Days • {plan.reach} Est. Views
                                    </div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '1.2rem', color: '#7c3aed' }}>
                                ₹{plan.price}
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handlePayment}
                    disabled={loading}
                    style={{
                        width: '100%', padding: '1rem', background: 'linear-gradient(45deg, #7c3aed, #ec4899)', color: '#fff',
                        border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: loading ? 'wait' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        fontSize: '1rem',
                        opacity: loading ? 0.7 : 1,
                        boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)'
                    }}
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Rocket size={20} />}
                    {loading ? 'Processing...' : `Pay ₹${selectedPlan.price} & Boost`}
                </button>
            </div>
        </div>
    );
};

export default ReelStudio;