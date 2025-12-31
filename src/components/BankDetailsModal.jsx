import React, { useState, useEffect } from 'react';
import { X, CreditCard, CheckCircle, Smartphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BankDetailsModal = ({ isOpen, onClose }) => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        accountName: '',
        accountNumber: '',
        ifscCode: '',
        bankName: '',
        upiId: ''
    });

    useEffect(() => {
        if (user?.bankDetails) {
            setFormData(user.bankDetails);
        }
    }, [user]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Update Frontend Context
            await updateUser({ bankDetails: formData });

            // 2. Sync to Backend (for persistent order linking)
            // Use user.id as the key (matches auth context ID)
            if (user?.id) {
                await fetch(`/api/users/${user.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user.id,
                        email: user.email,
                        name: user.name,
                        storeName: user.storeName,
                        bankDetails: formData
                    })
                });
            }

            alert('Bank details saved successfully!');
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to save details');
        } finally {
            setLoading(false);
        }
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

                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CreditCard size={28} color="#10b981" />
                    Payout Settings
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    Add your bank details to receive payments from buyers.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Account Holder Name</label>
                        <input
                            type="text"
                            name="accountName"
                            value={formData.accountName}
                            onChange={handleChange}
                            required
                            placeholder="e.g. John Doe"
                            style={{
                                width: '100%', padding: '0.8rem', borderRadius: '12px',
                                background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)',
                                color: '#fff', outline: 'none'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Account Number</label>
                        <input
                            type="text"
                            name="accountNumber"
                            value={formData.accountNumber}
                            onChange={handleChange}
                            required
                            placeholder="e.g. 1234567890"
                            style={{
                                width: '100%', padding: '0.8rem', borderRadius: '12px',
                                background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)',
                                color: '#fff', outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>IFSC Code</label>
                            <input
                                type="text"
                                name="ifscCode"
                                value={formData.ifscCode}
                                onChange={handleChange}
                                required
                                placeholder="e.g. HDFC0001234"
                                style={{
                                    width: '100%', padding: '0.8rem', borderRadius: '12px',
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)',
                                    color: '#fff', outline: 'none'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Bank Name</label>
                            <input
                                type="text"
                                name="bankName"
                                value={formData.bankName}
                                onChange={handleChange}
                                required
                                placeholder="e.g. HDFC Bank"
                                style={{
                                    width: '100%', padding: '0.8rem', borderRadius: '12px',
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)',
                                    color: '#fff', outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Smartphone size={16} /> UPI ID (Optional)
                        </label>
                        <input
                            type="text"
                            name="upiId"
                            value={formData.upiId}
                            onChange={handleChange}
                            placeholder="e.g. johndoe@okhdfcbank"
                            style={{
                                width: '100%', padding: '0.8rem', borderRadius: '12px',
                                background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)',
                                color: '#fff', outline: 'none'
                            }}
                        />
                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            marginTop: '1rem',
                            width: '100%', padding: '1rem',
                            background: 'linear-gradient(45deg, #10b981, #059669)',
                            color: '#fff', border: 'none', borderRadius: '12px',
                            fontWeight: 'bold', cursor: loading ? 'wait' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                        }}
                    >
                        {loading ? 'Saving...' : <><CheckCircle size={20} /> Save Details</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BankDetailsModal;
