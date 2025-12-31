import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, MoreVertical, ShoppingBag, MessageSquare, Volume2, VolumeX, X, Send, Link, Twitter, Facebook } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Reels = () => {
    const navigate = useNavigate();
    const { reels: contextReels, addOrder } = useMarketplace();
    const { user } = useAuth(); // Get logged in user for ownership check
    const [reels, setReels] = useState(contextReels || []);
    const [muted, setMuted] = useState(true);
    const [activeCommentReel, setActiveCommentReel] = useState(null);
    const [activeShareReel, setActiveShareReel] = useState(null);
    const [userId, setUserId] = useState('');
    const videoRefs = useRef({});
    const { addToast } = useToast();

    useEffect(() => {
        // Get or generate a temporary user ID for this browser
        let storedId = localStorage.getItem('u_id');
        if (!storedId) {
            storedId = 'user_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('u_id', storedId);
        }
        setUserId(storedId);

        fetchReels();
    }, []);

    useEffect(() => {
        // Initial load from context if available
        if (reels.length === 0 && contextReels.length > 0) {
            setReels(contextReels);
        }
    }, [contextReels]); // Only run when context updates, not reels state itself to avoid loop

    const fetchReels = async () => {
        try {
            const res = await fetch('/api/reels');
            if (res.ok) {
                const data = await res.json();
                if (data && data.length > 0) {
                    setReels(data);
                } else {
                    // API returned empty, use context
                    if (contextReels.length > 0) setReels(contextReels);
                }
            } else {
                console.log("API not reachable, using context reels as fallback");
                if (contextReels.length > 0) setReels(contextReels);
            }
        } catch (err) {
            console.error("Failed to fetch reels, using fallback", err);
            if (contextReels.length > 0) setReels(contextReels);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const videoId = entry.target.dataset.id;
                    const videoElement = videoRefs.current[videoId];

                    if (entry.isIntersecting) {
                        if (videoElement) {
                            // videoElement.currentTime = 0; // Don't restart on re-render/interact
                            videoElement.play().catch(err => console.log('Autoplay prevented:', err));

                            // Count view (debounce or check locally if needed, but for now strict increment)
                            if (!videoElement.viewed) {
                                videoElement.viewed = true;
                                fetch(`/api/reels/${videoId}/view`, { method: 'POST' }).catch(e => console.error("View count failed", e));
                            }
                        }
                    } else {
                        if (videoElement) {
                            videoElement.pause();
                            // Reset viewed status on scroll away? 
                            // Usually views are unique per session or per full watch. 
                            // Let's keep it simple: one view per load/scroll session per reel instance
                        }
                    }
                });
            },
            { threshold: 0.6 }
        );

        Object.values(videoRefs.current).forEach((el) => {
            if (el) {
                observer.observe(el.parentElement);
                el.viewed = false; // Reset property
            }
        });

        return () => observer.disconnect();
    }, [reels]);

    const toggleMute = () => setMuted(!muted);

    const handleLike = async (reelId) => {
        // Optimistic update
        setReels(prev => prev.map(r => {
            if (r._id === reelId) {
                const isLiked = Array.isArray(r.likes) && r.likes.includes(userId);
                const newLikes = isLiked
                    ? r.likes.filter(id => id !== userId)
                    : [...(r.likes || []), userId];
                return { ...r, likes: newLikes };
            }
            return r;
        }));

        try {
            const res = await fetch(`/api/reels/${reelId}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });
            if (res.ok) {
                const updatedReel = await res.json();
                // Sync with server response
                setReels(prev => prev.map(r => r._id === reelId ? updatedReel : r));
            }
        } catch (err) {
            console.log("Like API failed, keeping optimistic update");
        }
    };

    const handleDeleteReel = async (reelId) => {
        if (!window.confirm("Are you sure you want to delete this reel?")) return;

        try {
            const res = await fetch(`/api/reels/${reelId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id }) // Send userId for ownership verification
            });

            if (res.ok) {
                setReels(prev => prev.filter(r => r._id !== reelId));
                addToast("Reel deleted successfully");
            } else {
                const error = await res.json();
                addToast(`Failed to delete: ${error.message}`);
            }
        } catch (err) {
            console.error("Delete failed", err);
            addToast("Failed to delete reel");
        }
    };

    const handleShare = async (reel) => {
        const shareData = {
            title: `Check out this reel by ${reel.user?.name || 'UniXchange Seller'}`,
            text: reel.caption,
            url: window.location.href // ideally /reels/${reel._id}
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Error sharing', err);
            }
        } else {
            // Toggle share menu for desktop/fallback
            setActiveShareReel(activeShareReel === reel._id ? null : reel._id);
        }
    };

    const handleCommentClick = (reel) => {
        setActiveCommentReel(reel);
    };

    return (
        <div style={{
            height: '100%',
            overflowY: 'scroll',
            scrollSnapType: 'y mandatory',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '1rem 0',
            boxSizing: 'border-box',
            position: 'relative'
        }}>
            {reels.length === 0 && <p style={{ color: 'var(--text-secondary)', marginTop: '2rem' }}>No reels yet.</p>}

            {reels.map(reel => (
                <div key={reel._id} data-id={reel._id} style={{
                    scrollSnapAlign: 'center',
                    width: '100%',
                    maxWidth: '380px',
                    height: 'calc(100% - 2rem)',
                    background: '#000',
                    marginBottom: '1rem',
                    borderRadius: '12px',
                    position: 'relative',
                    flexShrink: 0,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}>
                    <video
                        ref={el => videoRefs.current[reel._id] = el}
                        src={reel.videoUrl}
                        loop
                        muted={muted}
                        playsInline
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onClick={toggleMute}
                    />

                    {/* Mute Indicator */}
                    <div
                        onClick={toggleMute}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            left: '20px',
                            background: 'rgba(0,0,0,0.5)',
                            padding: '8px',
                            borderRadius: '50%',
                            backdropFilter: 'blur(4px)',
                            cursor: 'pointer',
                            zIndex: 10
                        }}
                    >
                        {muted ? <VolumeX size={20} color="#fff" /> : <Volume2 size={20} color="#fff" />}
                    </div>


                    {/* Overlay Info & Buttons */}
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        padding: '1.5rem',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)',
                        pointerEvents: 'none'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                            {reel.user?.avatar ? (
                                <img src={reel.user.avatar} alt="User" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #FFD700' }} />
                            ) : (
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(45deg, #FFD700, #FFA500)' }} />
                            )}
                            <div>
                                <span style={{
                                    fontWeight: 800,
                                    fontSize: '1.1rem',
                                    display: 'block',
                                    background: 'linear-gradient(to right, #FFD700, #FDB931, #FFD700)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    textShadow: '0px 2px 4px rgba(0,0,0,0.3)',
                                    letterSpacing: '0.5px'
                                }}>
                                    {reel.user?.storeName || reel.user?.name || "Seller"}
                                </span>
                                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>Sponsored</span>
                            </div>
                        </div>
                        <p style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.4 }}>{reel.caption}</p>

                        <div style={{ display: 'flex', gap: '0.8rem', pointerEvents: 'auto' }}>
                            <button style={{
                                flex: 1, padding: '0.8rem', border: 'none', borderRadius: '8px',
                                background: '#7c3aed', color: '#fff', fontWeight: 'bold', fontSize: '0.9rem',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                            }} onClick={() => {
                                const price = Math.floor(Math.random() * 2000) + 500; // Simulated price
                                const productData = {
                                    name: "Featured Product", // Ideally from reel metadata
                                    amount: price,
                                    sourceReelId: reel._id || reel.id,
                                    // CRITICAL: sellerId must match the seller's Username or StoreName for Seller Analytics to pick it up
                                    sellerId: reel.user?.storeName || reel.user?.name || 'UniXchange Seller'
                                };
                                navigate('/app/checkout', { state: { product: productData } });
                            }}>
                                <ShoppingBag size={18} /> Buy Now
                            </button>
                            <button style={{
                                flex: 1, padding: '0.8rem', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px',
                                background: 'rgba(255,255,255,0.1)', color: '#fff', fontWeight: 'bold', fontSize: '0.9rem',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                backdropFilter: 'blur(10px)'
                            }} onClick={() => handleCommentClick(reel)}>
                                <MessageSquare size={18} /> Chat
                            </button>
                        </div>
                    </div>

                    {/* Right Side Actions */}
                    <div style={{
                        position: 'absolute', bottom: '120px', right: '10px',
                        display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', zIndex: 5
                    }}>
                        <ActionButton
                            icon={Heart}
                            label={Array.isArray(reel.likes) ? reel.likes.length : "0"}
                            onClick={() => handleLike(reel._id)}
                            active={Array.isArray(reel.likes) && reel.likes.includes(userId)}
                        />
                        <ActionButton
                            icon={MessageCircle}
                            label={reel.comments?.length || "0"}
                            onClick={() => handleCommentClick(reel)}
                        />
                        <div style={{ position: 'relative' }}>
                            <ActionButton icon={Share2} label="Share" onClick={() => handleShare(reel)} />

                            {/* Desktop Social Share Menu */}
                            {activeShareReel === reel._id && (
                                <div style={{
                                    position: 'absolute',
                                    right: '60px',
                                    bottom: '-20px',
                                    background: 'rgba(20, 20, 20, 0.95)',
                                    borderRadius: '12px',
                                    padding: '1rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.8rem',
                                    zIndex: 100,
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    backdropFilter: 'blur(10px)',
                                    width: '180px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Share via</span>
                                        <X size={16} onClick={() => setActiveShareReel(null)} style={{ cursor: 'pointer', color: '#fff' }} />
                                    </div>

                                    <ShareOption
                                        icon={Link}
                                        label="Copy Link"
                                        onClick={() => {
                                            navigator.clipboard.writeText(window.location.href);
                                            addToast("Link copied!");
                                            setActiveShareReel(null);
                                        }}
                                        color="#fff"
                                    />
                                    <ShareOption
                                        icon={Smartphone}
                                        label="WhatsApp"
                                        onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(reel.caption)}%20${encodeURIComponent(window.location.href)}`, '_blank')}
                                        color="#25D366"
                                    />
                                    <ShareOption
                                        icon={Twitter}
                                        label="Twitter"
                                        onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(reel.caption)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                                        color="#1DA1F2"
                                    />
                                    <ShareOption
                                        icon={Facebook}
                                        label="Facebook"
                                        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                                        color="#1877F2"
                                    />
                                </div>
                            )}
                        </div>

                        {/* More Options / Delete */}
                        <div style={{ position: 'relative' }}>
                            <ActionButton icon={MoreVertical} onClick={() => {
                                const menu = document.getElementById(`menu-${reel._id}`);
                                if (menu) menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
                            }} />

                            {/* Context Menu */}
                            <div id={`menu-${reel._id}`} style={{
                                display: 'none',
                                position: 'absolute',
                                right: '50px',
                                bottom: '0',
                                background: 'rgba(0,0,0,0.9)',
                                borderRadius: '8px',
                                padding: '0.5rem',
                                zIndex: 100,
                                minWidth: '120px',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                {user && reel.user?.userId === user.id && (
                                    <button
                                        onClick={() => handleDeleteReel(reel._id)}
                                        style={{
                                            display: 'block',
                                            width: '100%',
                                            padding: '0.5rem',
                                            background: 'none',
                                            border: 'none',
                                            color: '#ef4444',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Delete Reel
                                    </button>
                                )}
                                <button
                                    onClick={() => addToast('Report Reel')}
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        padding: '0.5rem',
                                        background: 'none',
                                        border: 'none',
                                        color: '#fff',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    Report
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Comment Section (Overlay inside Reel) */}
                    {activeCommentReel?._id === reel._id && (
                        <div style={{
                            position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%',
                            background: 'var(--card-bg)', borderTopLeftRadius: '20px', borderTopRightRadius: '20px',
                            zIndex: 20, display: 'flex', flexDirection: 'column', boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
                            transition: 'bottom 0.3s ease-out'
                        }}>
                            <div style={{
                                padding: '0.8rem 1rem', borderBottom: '1px solid var(--border-color)',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                            }}>
                                <h4 style={{ fontWeight: 700, margin: 0, fontSize: '0.95rem' }}>Comments ({reel.comments?.length || 0})</h4>
                                <button onClick={() => setActiveCommentReel(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-color)', padding: 0 }}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto', padding: '0.8rem' }}>
                                {reel.comments?.length === 0 ? (
                                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '1rem' }}>No comments yet.</p>
                                ) : (
                                    reel.comments?.map((c, i) => (
                                        <div key={i} style={{ marginBottom: '0.8rem', display: 'flex', gap: '0.6rem' }}>
                                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ccc', flexShrink: 0 }} />
                                            <div>
                                                <span style={{ fontWeight: 600, fontSize: '0.85rem', marginRight: '0.5rem' }}>{c.user}</span>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(c.createdAt).toLocaleDateString()}</span>
                                                <p style={{ fontSize: '0.85rem', marginTop: '0.1rem', lineHeight: '1.3' }}>{c.text}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <CommentForm reel={reel} onCommentAdded={(updatedReel) => {
                                setReels(prev => prev.map(r => r._id === updatedReel._id ? updatedReel : r));
                            }} />
                        </div>
                    )}
                </div>
            ))}
        </div >
    );
};

const ActionButton = ({ icon: Icon, label, onClick, active }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
        <button
            onClick={onClick}
            style={{
                background: 'rgba(0,0,0,0.4)',
                border: 'none',
                borderRadius: '50%',
                width: '45px',
                height: '45px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(5px)',
                transition: 'transform 0.1s'
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
            <Icon size={24} color={active ? "#ef4444" : "#fff"} fill={active ? "#ef4444" : "none"} />
        </button>
        {label && <span style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>{label}</span>}
    </div>
);

const ShareOption = ({ icon: Icon, label, onClick, color }) => (
    <button onClick={onClick} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: 'rgba(255,255,255,0.05)',
        border: 'none',
        borderRadius: '8px',
        padding: '0.6rem',
        cursor: 'pointer',
        width: '100%',
        color: '#fff',
        transition: 'background 0.2s'
    }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
    >
        <Icon size={18} color={color} />
        <span style={{ fontSize: '0.9rem' }}>{label}</span>
    </button>
);

const CommentForm = ({ reel, onCommentAdded }) => {
    const [text, setText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        setIsSubmitting(true);

        try {
            const res = await fetch(`/api/reels/${reel._id}/comment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, user: 'You' })
            });
            if (res.ok) {
                const updatedReel = await res.json();
                onCommentAdded(updatedReel);
                setText('');
            } else {
                throw new Error("API failed");
            }
        } catch (err) {
            console.log("Comment API failed, using local fallback");
            // Local fallback for demo/offline
            const newComment = {
                user: 'You',
                text: text,
                createdAt: new Date().toISOString()
            };
            const updatedReel = {
                ...reel,
                comments: [newComment, ...(reel.comments || [])]
            };
            onCommentAdded(updatedReel);
            setText('');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{
            padding: '0.8rem', borderTop: '1px solid var(--border-color)',
            display: 'flex', gap: '0.5rem', alignItems: 'center'
        }}>
            <input
                type="text"
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Add a comment..."
                style={{
                    flex: 1, padding: '0.6rem 1rem', borderRadius: '20px', border: '1px solid var(--border-color)',
                    background: 'var(--hover-bg)', color: 'var(--text-color)', outline: 'none', fontSize: '0.9rem'
                }}
            />
            <button type="submit" disabled={isSubmitting || !text.trim()} style={{
                background: 'none', border: 'none', color: '#7c3aed', cursor: 'pointer',
                opacity: !text.trim() ? 0.5 : 1, display: 'flex', alignItems: 'center'
            }}>
                <Send size={20} />
            </button>
        </form>
    );
};

export default Reels;
