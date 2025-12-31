import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Smartphone, Trash2, ChevronLeft, ToggleLeft, ToggleRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacySecurity = () => {
    const navigate = useNavigate();
    const [twoFactor, setTwoFactor] = useState(false);
    const [dataSharing, setDataSharing] = useState(true);

    const Section = ({ title, children }) => (
        <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-color)' }}>{title}</h2>
            <div style={{
                background: 'var(--card-bg)',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                overflow: 'hidden'
            }}>
                {children}
            </div>
        </div>
    );

    const Item = ({ icon: Icon, label, description, action, danger }) => (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.5rem',
            borderBottom: '1px solid var(--border-color)',
            background: danger ? 'rgba(239, 68, 68, 0.05)' : 'transparent'
        }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                    padding: '0.5rem',
                    borderRadius: '8px',
                    background: danger ? 'rgba(239, 68, 68, 0.1)' : 'var(--hover-bg)',
                    color: danger ? '#ef4444' : 'var(--primary-color)'
                }}>
                    <Icon size={20} />
                </div>
                <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.25rem', color: danger ? '#ef4444' : 'var(--text-color)' }}>{label}</h3>
                    {description && <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{description}</p>}
                </div>
            </div>
            {action}
        </div>
    );

    const Toggle = ({ value, onChange }) => (
        <div onClick={() => onChange(!value)} style={{ cursor: 'pointer', color: value ? 'var(--primary-color)' : 'var(--text-secondary)' }}>
            {value ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}
        >
            <button
                onClick={() => navigate(-1)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    marginBottom: '2rem',
                    fontSize: '1rem'
                }}
            >
                <ChevronLeft size={20} />
                Back to Settings
            </button>

            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-color)' }}>Privacy & Security</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Manage your account security and privacy preferences.</p>

            <Section title="Security">
                <Item
                    icon={Smartphone}
                    label="Two-Factor Authentication"
                    description="Add an extra layer of security to your account."
                    action={<Toggle value={twoFactor} onChange={setTwoFactor} />}
                />
                <Item
                    icon={Lock}
                    label="Password"
                    description="Last changed 3 months ago"
                    action={<button style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        background: 'transparent',
                        color: 'var(--text-color)',
                        cursor: 'pointer'
                    }}>Change</button>}
                />
            </Section>

            <Section title="Privacy">
                <Item
                    icon={Shield}
                    label="Data Sharing"
                    description="Allow us to use your data to improve our services."
                    action={<Toggle value={dataSharing} onChange={setDataSharing} />}
                />
            </Section>

            <Section title="Danger Zone">
                <Item
                    icon={Trash2}
                    label="Delete Account"
                    description="Permanently delete your account and all of your content."
                    danger
                    action={<button style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid #ef4444',
                        background: '#ef4444',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: '500'
                    }}>Delete</button>}
                />
            </Section>
        </motion.div>
    );
};

export default PrivacySecurity;
