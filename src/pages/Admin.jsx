import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Trash2, DollarSign, CreditCard, Building, Plus, CheckCircle, ShieldCheck } from 'lucide-react';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('users'); // 'users' | 'revenue'
    const [adminBank, setAdminBank] = useState(null);
    const [showBankForm, setShowBankForm] = useState(false);
    const [bankForm, setBankForm] = useState({
        holderName: '',
        bankName: '',
        accountNumber: '',
        ifsc: ''
    });

    useEffect(() => {
        const storedUsers = localStorage.getItem('unixchange_users');
        if (storedUsers) {
            setUsers(JSON.parse(storedUsers));
        }
        const storedBank = localStorage.getItem('unixchange_admin_bank');
        if (storedBank) {
            setAdminBank(JSON.parse(storedBank));
        }
    }, []);

    const handleSaveBank = (e) => {
        e.preventDefault();
        const bankData = { ...bankForm, connectedAt: new Date().toISOString() };
        setAdminBank(bankData);
        localStorage.setItem('unixchange_admin_bank', JSON.stringify(bankData));
        setShowBankForm(false);
        alert('Receiving account linked successfully!');
    };

    const clearDatabase = () => {
        if (window.confirm('Are you sure you want to delete all users? This cannot be undone.')) {
            localStorage.removeItem('unixchange_users');
            localStorage.removeItem('unixchange_current_user');
            setUsers([]);
            window.location.reload();
        }
    };

    return (
        <div style={{ padding: '2rem', color: '#fff', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {activeTab === 'users' ? <Users color="#c4b5fd" /> : <DollarSign color="#4ade80" />}
                    {activeTab === 'users' ? 'User Database' : 'Revenue & Finance'}
                </h1>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => setActiveTab('users')}
                    style={{
                        padding: '0.8rem 1.5rem',
                        borderRadius: '12px',
                        background: activeTab === 'users' ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                        color: activeTab === 'users' ? '#fff' : 'var(--text-secondary)',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        display: 'flex', alignItems: 'center', gap: '0.5rem'
                    }}
                >
                    <Users size={18} /> Users
                </button>
                <button
                    onClick={() => setActiveTab('revenue')}
                    style={{
                        padding: '0.8rem 1.5rem',
                        borderRadius: '12px',
                        background: activeTab === 'revenue' ? '#22c55e' : 'rgba(255,255,255,0.05)',
                        color: activeTab === 'revenue' ? '#fff' : 'var(--text-secondary)',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        display: 'flex', alignItems: 'center', gap: '0.5rem'
                    }}
                >
                    <DollarSign size={18} /> Revenue Settings
                </button>
            </div>

            {activeTab === 'users' && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                        <button
                            onClick={clearDatabase}
                            style={{
                                padding: '0.5rem 1rem',
                                background: 'rgba(239, 68, 68, 0.2)',
                                color: '#fca5a5',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <Trash2 size={16} />
                            Clear DB
                        </button>
                    </div>
                </>
            )}

            {activeTab === 'users' ? (
                <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={{ padding: '1rem', color: 'var(--accent-color)' }}>Name</th>
                                <th style={{ padding: '1rem', color: 'var(--accent-color)' }}>Email</th>
                                <th style={{ padding: '1rem', color: 'var(--accent-color)' }}>Joined At</th>
                                <th style={{ padding: '1rem', color: 'var(--accent-color)' }}>Password (Raw)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                                        No users found in database.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user, index) => (
                                    <motion.tr
                                        key={user.id || index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                                    >
                                        <td style={{ padding: '1rem' }}>{user.name}</td>
                                        <td style={{ padding: '1rem', fontFamily: 'monospace' }}>{user.email}</td>
                                        <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
                                            {new Date(user.joinedAt).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '1rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)' }}>
                                            {user.password}
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Revenue Overview */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)' }}>
                            <h3 style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <DollarSign size={16} /> Total Revenue
                            </h3>
                            <p style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.5rem' }}>₹12,450</p>
                            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', marginTop: '0.5rem' }}>+12% from last month</p>
                        </div>
                        <div style={{ background: 'var(--card-bg)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border-color)' }}>
                            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <CreditCard size={16} /> Pending Payout
                            </h3>
                            <p style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.5rem' }}>₹0</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>All Caught Up</p>
                        </div>
                    </div>

                    {/* Receiving Account Section */}
                    <div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Building size={24} color="#38bdf8" />
                            Receiving Bank Account
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            Link your bank account to receive payments from the platform directly.
                        </p>

                        {!adminBank && !showBankForm && (
                            <button
                                onClick={() => setShowBankForm(true)}
                                style={{
                                    padding: '1rem 2rem',
                                    background: 'var(--card-bg)',
                                    border: '2px dashed var(--border-color)',
                                    borderRadius: '16px',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    width: '100%',
                                    maxWidth: '400px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ background: 'var(--hover-bg)', padding: '1rem', borderRadius: '50%' }}>
                                    <Plus size={24} color="var(--primary-color)" />
                                </div>
                                <span style={{ fontWeight: 'bold' }}>Link Bank Account</span>
                            </button>
                        )}

                        {showBankForm && (
                            <motion.form
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onSubmit={handleSaveBank}
                                style={{
                                    background: 'var(--card-bg)',
                                    padding: '2rem',
                                    borderRadius: '16px',
                                    border: '1px solid var(--border-color)',
                                    maxWidth: '500px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem'
                                }}
                            >
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Account Holder Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={bankForm.holderName}
                                        onChange={e => setBankForm({ ...bankForm, holderName: e.target.value })}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: '#fff' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Bank Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={bankForm.bankName}
                                        onChange={e => setBankForm({ ...bankForm, bankName: e.target.value })}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: '#fff' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Account Number</label>
                                        <input
                                            type="password"
                                            required
                                            value={bankForm.accountNumber}
                                            onChange={e => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: '#fff' }}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>IFSC Code</label>
                                        <input
                                            type="text"
                                            required
                                            value={bankForm.ifsc}
                                            onChange={e => setBankForm({ ...bankForm, ifsc: e.target.value.toUpperCase() })}
                                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: '#fff' }}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowBankForm(false)}
                                        style={{ flex: 1, padding: '0.8rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', borderRadius: '8px', cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        style={{ flex: 1, padding: '0.8rem', background: 'var(--primary-color)', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                        Save Account
                                    </button>
                                </div>
                            </motion.form>
                        )}

                        {adminBank && (
                            <div style={{
                                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                border: '1px solid rgba(255,255,255,0.1)',
                                maxWidth: '500px',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '100px', height: '100px', background: '#38bdf8', opacity: 0.1, borderRadius: '50%', filter: 'blur(20px)' }}></div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                    <div>
                                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Linked Account</p>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{adminBank.bankName}</h3>
                                    </div>
                                    <ShieldCheck size={24} color="#4ade80" />
                                </div>

                                <div style={{ fontSize: '1.5rem', letterSpacing: '2px', fontFamily: 'monospace', marginBottom: '2rem' }}>
                                    •••• •••• {adminBank.accountNumber.slice(-4)}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    <div>
                                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>Account Holder</p>
                                        <p style={{ fontWeight: 'bold' }}>{adminBank.holderName.toUpperCase()}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Disconnect this account?')) {
                                                setAdminBank(null);
                                                localStorage.removeItem('unixchange_admin_bank');
                                            }
                                        }}
                                        style={{
                                            background: 'rgba(239, 68, 68, 0.2)',
                                            color: '#fca5a5',
                                            border: 'none',
                                            padding: '0.4rem 0.8rem',
                                            borderRadius: '6px',
                                            fontSize: '0.8rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Disconnect
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
};

export default Admin;
