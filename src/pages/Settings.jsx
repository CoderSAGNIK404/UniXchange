import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Moon, Shield, HelpCircle, LogOut, ChevronRight, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ChangePasswordModal from '../components/ChangePasswordModal';

const Settings = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [notifications, setNotifications] = useState(true);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const sections = [
        {
            title: "Account",
            items: [
                { icon: User, label: "Edit Profile", onClick: () => navigate('/app/profile') },
                { icon: Lock, label: "Change Password", onClick: () => setIsPasswordModalOpen(true) },
                { icon: Shield, label: "Privacy & Security", onClick: () => navigate('/app/settings/privacy') }
            ]
        },
        {
            title: "Preferences",
            items: [
                {
                    icon: Bell,
                    label: "Notifications",
                    type: "toggle",
                    value: notifications,
                    onToggle: () => setNotifications(!notifications)
                },
                {
                    icon: Moon,
                    label: "Dark Mode",
                    type: "toggle",
                    value: theme === 'dark',
                    onToggle: toggleTheme
                }
            ]
        },
        {
            title: "Support",
            items: [
                { icon: HelpCircle, label: "Help & Support", onClick: () => navigate('/app/settings/help') }
            ]
        }
    ];

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            logout();
            navigate('/auth');
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', color: 'var(--text-color)' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Settings</h1>

            {sections.map((section, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    style={{ marginBottom: '2rem' }}
                >
                    <h2 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1rem', paddingLeft: '0.5rem' }}>
                        {section.title}
                    </h2>
                    <div style={{
                        background: 'var(--card-bg)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: '1px solid var(--border-color)',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                        {section.items.map((item, i) => (
                            <div
                                key={i}
                                onClick={item.onClick}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '1.2rem',
                                    borderBottom: i < section.items.length - 1 ? '1px solid var(--border-color)' : 'none',
                                    cursor: item.type === 'toggle' ? 'default' : 'pointer',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    if (item.type !== 'toggle') e.currentTarget.style.background = 'var(--hover-bg)';
                                }}
                                onMouseLeave={(e) => {
                                    if (item.type !== 'toggle') e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '8px',
                                        background: 'rgba(139, 92, 246, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--primary-color)'
                                    }}>
                                        <item.icon size={20} />
                                    </div>
                                    <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-color)' }}>{item.label}</span>
                                </div>

                                {item.type === 'toggle' ? (
                                    <div
                                        onClick={item.onToggle}
                                        style={{
                                            width: '50px',
                                            height: '28px',
                                            background: item.value ? 'var(--primary-color)' : 'var(--text-secondary)',
                                            borderRadius: '20px',
                                            position: 'relative',
                                            cursor: 'pointer',
                                            transition: 'background 0.3s',
                                            opacity: item.value ? 1 : 0.5
                                        }}
                                    >
                                        <motion.div
                                            animate={{ x: item.value ? 24 : 2 }}
                                            style={{
                                                width: '24px',
                                                height: '24px',
                                                background: '#fff',
                                                borderRadius: '50%',
                                                position: 'absolute',
                                                top: '2px',
                                                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <ChevronRight size={20} color="var(--text-secondary)" />
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>
            ))}

            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                onClick={handleLogout}
                style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '16px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginTop: '1rem'
                }}
                whileHover={{ scale: 1.02, background: 'rgba(239, 68, 68, 0.2)' }}
                whileTap={{ scale: 0.98 }}
            >
                <LogOut size={20} />
                Log Out
            </motion.button>

            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
        </div>
    );
};

export default Settings;
