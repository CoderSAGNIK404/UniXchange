import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Camera, Save, User, Mail, Calendar, ShoppingBag } from 'lucide-react';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [storeName, setStoreName] = useState(user?.storeName || '');
    const [previewImage, setPreviewImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);

    // Sync state with user context
    React.useEffect(() => {
        if (user) {
            setName(user.name || '');
            setStoreName(user.storeName || '');
        }
    }, [user]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
                setIsEditing(true); // Enable save button
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        const updates = { name, storeName };
        if (previewImage) {
            updates.photoUrl = previewImage;
        }
        await updateUser(updates);
        setIsLoading(false);
        setIsEditing(false);
        setPreviewImage(null); // Clear preview after save
    };

    if (!user) return <div style={{ padding: '2rem', color: '#fff' }}>Please log in to view profile.</div>;

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', color: '#fff' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>My Profile</h1>

            <div style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '24px',
                padding: '3rem',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2rem'
            }}>
                {/* Profile Picture Section */}
                <div style={{ position: 'relative' }}>
                    <div style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '4rem',
                        fontWeight: 'bold',
                        overflow: 'hidden',
                        border: '4px solid rgba(255,255,255,0.1)'
                    }}>
                        {previewImage || user.photoUrl ? (
                            <img src={previewImage || user.photoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            user.name?.charAt(0).toUpperCase()
                        )}
                    </div>
                    <button
                        onClick={() => fileInputRef.current.click()}
                        style={{
                            position: 'absolute',
                            bottom: '5px',
                            right: '5px',
                            background: 'var(--primary-color)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                        }}
                    >
                        <Camera size={20} color="#fff" />
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />
                </div>

                {/* User Details Section */}
                <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Name Field */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                            Full Name
                        </label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{
                                flex: 1,
                                background: 'rgba(0,0,0,0.2)',
                                borderRadius: '12px',
                                padding: '0.8rem 1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                border: isEditing ? '1px solid var(--primary-color)' : '1px solid rgba(255,255,255,0.1)'
                            }}>
                                <User size={20} color="var(--accent-color)" />
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#fff',
                                            width: '100%',
                                            outline: 'none',
                                            fontSize: '1rem'
                                        }}
                                    />
                                ) : (
                                    <span style={{ fontSize: '1rem' }}>{user.name}</span>
                                )}
                            </div>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        padding: '0 1.5rem',
                                        cursor: 'pointer',
                                        color: '#fff',
                                        fontWeight: 500
                                    }}
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Store Name Field */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                            Store Name
                        </label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{
                                flex: 1,
                                background: 'rgba(0,0,0,0.2)',
                                borderRadius: '12px',
                                padding: '0.8rem 1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                border: isEditing ? '1px solid var(--primary-color)' : '1px solid rgba(255,255,255,0.1)'
                            }}>
                                <ShoppingBag size={20} color="var(--accent-color)" />
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={storeName}
                                        onChange={(e) => setStoreName(e.target.value)}
                                        placeholder="Enter your store name"
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#fff',
                                            width: '100%',
                                            outline: 'none',
                                            fontSize: '1rem'
                                        }}
                                    />
                                ) : (
                                    <span style={{ fontSize: '1rem' }}>{user.storeName || 'Not Set'}</span>
                                )}
                            </div>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        padding: '0 1.5rem',
                                        cursor: 'pointer',
                                        color: '#fff',
                                        fontWeight: 500
                                    }}
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Email Field (Read Only) */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                            Email Address
                        </label>
                        <div style={{
                            background: 'rgba(0,0,0,0.2)',
                            borderRadius: '12px',
                            padding: '0.8rem 1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            border: '1px solid rgba(255,255,255,0.05)',
                            opacity: 0.7
                        }}>
                            <Mail size={20} color="var(--accent-color)" />
                            <span style={{ fontSize: '1rem' }}>{user.email}</span>
                        </div>
                    </div>

                    {/* Joined Date (Read Only) */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                            Member Since
                        </label>
                        <div style={{
                            background: 'rgba(0,0,0,0.2)',
                            borderRadius: '12px',
                            padding: '0.8rem 1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            border: '1px solid rgba(255,255,255,0.05)',
                            opacity: 0.7
                        }}>
                            <Calendar size={20} color="var(--accent-color)" />
                            <span style={{ fontSize: '1rem' }}>{new Date(user.joinedAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                </div>

                {/* Save Button at the Bottom */}
                {isEditing && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSave}
                        disabled={isLoading}
                        style={{
                            marginTop: '1rem',
                            width: '100%',
                            maxWidth: '500px',
                            padding: '1rem',
                            background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))',
                            border: 'none',
                            borderRadius: '12px',
                            color: '#fff',
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 10px 25px -5px rgba(139, 92, 246, 0.5)'
                        }}
                    >
                        <Save size={20} />
                        {isLoading ? 'Saving Changes...' : 'Save Changes'}
                    </motion.button>
                )}
            </div>
        </div>
    );
};

export default Profile;
