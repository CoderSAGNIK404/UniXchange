import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const plans = [
    {
        name: "Student Basic",
        price: "Free",
        description: "Perfect for buying essentials and occasional selling.",
        features: [
            "Browse all items",
            "Contact sellers",
            "List up to 3 items/month",
            "Basic support",
            "Community access"
        ],
        notIncluded: [
            "Featured listings",
            "Analytics dashboard",
            "Priority support"
        ],
        color: "#94a3b8",
        buttonText: "Current Plan"
    },
    {
        name: "Campus Pro",
        price: "₹349",
        period: "/month",
        description: "For active students who buy and sell frequently.",
        features: [
            "Everything in Basic",
            "Unlimited listings",
            "Featured listings (2x visibility)",
            "Instant notifications",
            "Verified badge"
        ],
        notIncluded: [
            "Bulk upload tools",
            "Dedicated account manager"
        ],
        color: "#8b5cf6",
        popular: true,
        buttonText: "Upgrade to Pro"
    },
    {
        name: "Power Seller",
        price: "₹799",
        period: "/month",
        description: "For student entrepreneurs and small businesses.",
        features: [
            "Everything in Pro",
            "Bulk listing tools",
            "Advanced analytics",
            "Priority 24/7 support",
            "Top placement in search",
            "0% transaction fees"
        ],
        notIncluded: [],
        color: "#ec4899",
        buttonText: "Go Power"
    }
];

const Pricing = () => {
    return (
        <div style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto', color: '#fff' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                    Simple, Transparent Pricing
                </h1>
                <p style={{ fontSize: '1.2rem', color: '#a1a1aa', maxWidth: '600px', margin: '0 auto' }}>
                    Choose the plan that fits your campus needs. Upgrade or downgrade at any time.
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                alignItems: 'start'
            }}>
                {plans.map((plan, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -10 }}
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '24px',
                            padding: '2rem',
                            border: plan.popular ? `2px solid ${plan.color}` : '1px solid rgba(255,255,255,0.1)',
                            position: 'relative',
                            boxShadow: plan.popular ? `0 0 30px -10px ${plan.color}40` : 'none'
                        }}
                    >
                        {plan.popular && (
                            <div style={{
                                position: 'absolute',
                                top: '-12px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: plan.color,
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                color: '#fff'
                            }}>
                                MOST POPULAR
                            </div>
                        )}

                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: plan.color }}>
                                {plan.name}
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{plan.price}</span>
                                {plan.period && <span style={{ color: '#a1a1aa' }}>{plan.period}</span>}
                            </div>
                            <p style={{ color: '#a1a1aa', marginTop: '1rem', lineHeight: 1.5 }}>
                                {plan.description}
                            </p>
                        </div>

                        <button style={{
                            width: '100%',
                            padding: '1rem',
                            borderRadius: '12px',
                            border: 'none',
                            background: plan.popular ? plan.color : 'rgba(255,255,255,0.1)',
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            marginBottom: '2rem',
                            transition: 'all 0.2s'
                        }}>
                            {plan.buttonText}
                        </button>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {plan.features.map((feature, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{
                                        background: `${plan.color}20`,
                                        borderRadius: '50%',
                                        padding: '4px',
                                        display: 'flex'
                                    }}>
                                        <Check size={14} color={plan.color} />
                                    </div>
                                    <span style={{ fontSize: '0.95rem' }}>{feature}</span>
                                </div>
                            ))}
                            {plan.notIncluded.map((feature, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.5 }}>
                                    <div style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: '50%',
                                        padding: '4px',
                                        display: 'flex'
                                    }}>
                                        <X size={14} />
                                    </div>
                                    <span style={{ fontSize: '0.95rem' }}>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Pricing;
