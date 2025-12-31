import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, MessageCircle, FileText, ChevronDown, ChevronUp, ChevronLeft, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HelpSupport = () => {
    const navigate = useNavigate();

    const faqs = [
        {
            question: "How do I reset my password?",
            answer: "You can reset your password by going to Settings > Privacy & Security > Password. If you are logged out, use the 'Forgot Password' link on the login page."
        },
        {
            question: "How do I contact support?",
            answer: "You can contact our support team by clicking the 'Contact Us' button below or emailing unixchangecampus@gmail.com."
        },
        {
            question: "Is my payment information secure?",
            answer: "Yes, we use industry-standard encryption to protect your payment information. We do not store your credit card details on our servers."
        },
        {
            question: "Can I change my username?",
            answer: "Currently, usernames cannot be changed once created. Please contact support if you have a specific reason for needing a change."
        }
    ];

    const FAQItem = ({ question, answer }) => {
        const [isOpen, setIsOpen] = useState(false);

        return (
            <div style={{ borderBottom: '1px solid var(--border-color)' }}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1.5rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-color)',
                        textAlign: 'left'
                    }}
                >
                    <span style={{ fontWeight: '500', fontSize: '1rem' }}>{question}</span>
                    {isOpen ? <ChevronUp size={20} color="var(--text-secondary)" /> : <ChevronDown size={20} color="var(--text-secondary)" />}
                </button>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            style={{ overflow: 'hidden' }}
                        >
                            <p style={{ padding: '0 1.5rem 1.5rem 1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                {answer}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

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

            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-color)' }}>How can we help?</h1>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    background: 'var(--card-bg)',
                    padding: '1rem',
                    borderRadius: '12px',
                    maxWidth: '500px',
                    margin: '0 auto',
                    border: '1px solid var(--border-color)'
                }}>
                    <HelpCircle color="var(--text-secondary)" />
                    <input
                        type="text"
                        placeholder="Search for help..."
                        style={{
                            border: 'none',
                            background: 'transparent',
                            width: '100%',
                            fontSize: '1rem',
                            color: 'var(--text-color)',
                            outline: 'none'
                        }}
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div style={{
                    padding: '1.5rem',
                    background: 'var(--card-bg)',
                    borderRadius: '16px',
                    border: '1px solid var(--border-color)',
                    textAlign: 'center'
                }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '12px',
                        background: 'rgba(139, 92, 246, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem auto',
                        color: 'var(--primary-color)'
                    }}>
                        <MessageCircle size={24} />
                    </div>
                    <h3 style={{ fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-color)' }}>Chat Support</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>Talk to our friendly support team.</p>
                    <button style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        background: 'var(--primary-color)',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '500'
                    }}>Start Chat</button>
                </div>

                <div style={{
                    padding: '1.5rem',
                    background: 'var(--card-bg)',
                    borderRadius: '16px',
                    border: '1px solid var(--border-color)',
                    textAlign: 'center'
                }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '12px',
                        background: 'rgba(59, 130, 246, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem auto',
                        color: '#3b82f6'
                    }}>
                        <Mail size={24} />
                    </div>
                    <h3 style={{ fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-color)' }}>Email Us</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>Get help via email within 24 hours.</p>
                    <button style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        background: 'transparent',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)',
                        cursor: 'pointer',
                        fontWeight: '500'
                    }}>Send Email</button>
                </div>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--text-color)' }}>Frequently Asked Questions</h2>
            <div style={{
                background: 'var(--card-bg)',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                overflow: 'hidden'
            }}>
                {faqs.map((faq, index) => (
                    <FAQItem key={index} question={faq.question} answer={faq.answer} />
                ))}
            </div>
        </motion.div>
    );
};

export default HelpSupport;
