import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Background from '../components/Background';
import gsap from 'gsap';
import { motion } from 'framer-motion';

function LandingPage() {
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const btnRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo(titleRef.current,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, delay: 0.5 }
        )
            .fromTo(subtitleRef.current,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 1 },
                "-=0.5"
            )
            .fromTo(btnRef.current,
                { y: 20, opacity: 0, scale: 0.9 },
                { y: 0, opacity: 1, scale: 1, duration: 0.8 },
                "-=0.5"
            );
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50, transition: { duration: 0.5 } }}
            style={{ width: '100%', height: '100%' }}
        >
            <Background />
            <main style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                color: 'var(--text-color)',
                textAlign: 'center',
                padding: '0 20px'
            }}>
                <h1 ref={titleRef} style={{
                    fontSize: 'clamp(3rem, 8vw, 6rem)',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #fff 0%, #c4b5fd 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '1rem',
                    letterSpacing: '-0.02em'
                }}>
                    UniXchange
                </h1>
                <p ref={subtitleRef} style={{
                    fontSize: 'clamp(1rem, 2vw, 1.5rem)',
                    color: 'rgba(255,255,255,0.7)',
                    maxWidth: '600px',
                    marginBottom: '3rem',
                    lineHeight: 1.6
                }}>
                    Experience the future of digital exchange with our premium, secure, and lightning-fast platform.
                </p>
                <button ref={btnRef} style={{
                    padding: '1rem 2.5rem',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: '#fff',
                    background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))',
                    border: 'none',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    boxShadow: '0 10px 25px -5px rgba(139, 92, 246, 0.5)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                    onMouseEnter={(e) => gsap.to(e.target, { scale: 1.05, duration: 0.2 })}
                    onMouseLeave={(e) => gsap.to(e.target, { scale: 1, duration: 0.2 })}
                    onClick={() => navigate('/auth')}
                >
                    Get Started
                </button>
            </main>
        </motion.div>
    );
}

export default LandingPage;
