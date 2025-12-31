import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Instagram, Linkedin, Twitter } from 'lucide-react';
import sagnikImg from '../assets/sagnik.jpg';
import krishnenduImg from '../assets/krishnendu.jpg';

const About = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{
                padding: '2rem',
                maxWidth: '1200px',
                margin: '0 auto',
                color: 'var(--text-color)',
                paddingBottom: '4rem'
            }}
        >


            {/* Main Content Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                marginBottom: '4rem'
            }}>
                <motion.div variants={itemVariants} style={{
                    background: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(10px)',
                    padding: '2rem',
                    borderRadius: '20px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ color: 'var(--accent-color)', marginBottom: '1rem', fontSize: '1.5rem' }}>Our Vision</h2>
                    <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                        We make exchanging products easier, faster, and more trusted—whether you’re looking to buy essential items or sell something you no longer need.
                        Created for students, creators, and young hustlers, UniXchange blends a shopping experience with a social media vibe.
                    </p>
                </motion.div>

                <motion.div variants={itemVariants} style={{
                    background: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(10px)',
                    padding: '2rem',
                    borderRadius: '20px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ color: 'var(--accent-color)', marginBottom: '1rem', fontSize: '1.5rem' }}>Our Mission</h2>
                    <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                        To make campus commerce smoother, safer, and more fun.
                        With UniXchange, anyone can become a seller, build their own brand, track revenue, and grow an audience—all from a single dashboard.
                    </p>
                </motion.div>
            </div>

            {/* Why UniXchange Section */}
            <motion.section variants={itemVariants} style={{ marginBottom: '5rem', textAlign: 'center' }}>
                <div style={{
                    background: 'rgba(139, 92, 246, 0.05)',
                    borderRadius: '24px',
                    padding: '3rem',
                    border: '1px solid rgba(139, 92, 246, 0.1)'
                }}>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>More Than Just a Marketplace</h2>
                    <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '700px', margin: '0 auto 2rem', fontSize: '1.1rem' }}>
                        It’s a student-driven economy—built for trust, speed, and opportunity. Buyers get access to clean, verified listings, smooth UI, a powerful search system, and engaging product reels.
                    </p>
                </div>
            </motion.section>

            {/* Founders Section */}
            <motion.section variants={itemVariants} style={{ marginBottom: '5rem' }}>
                <h2 style={{
                    fontSize: '2.5rem',
                    textAlign: 'center',
                    marginBottom: '3rem',
                    background: 'linear-gradient(90deg, var(--primary-color), var(--accent-color))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    Meet The Founders
                </h2>

                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '3rem'
                }}>
                    {/* Founder 1 */}
                    <div style={{
                        flex: '1 1 300px',
                        maxWidth: '400px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.1)',
                        transition: 'transform 0.3s ease',
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{
                            height: '350px',
                            background: 'linear-gradient(45deg, #1a1a1a, #2a2a2a)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                        }}>
                            <img
                                src={sagnikImg}
                                alt="Sagnik Sarkar"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'center 20%', // Focus on the upper part (face)
                                    transform: 'scale(1.5)' // Zoom in as requested
                                }}
                            />
                        </div>
                        <div style={{ padding: '2rem' }}>
                            <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Sagnik Sarkar</h3>
                            <p style={{ color: 'var(--accent-color)', marginBottom: '1rem', fontWeight: '600' }}>Founder</p>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.5 }}>
                                Emerging entrepreneur passionate to change the financial conditions of college students.
                            </p>
                        </div>
                    </div>

                    {/* Founder 2 */}
                    <div style={{
                        flex: '1 1 300px',
                        maxWidth: '400px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.1)',
                        transition: 'transform 0.3s ease',
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{
                            height: '350px',
                            background: 'linear-gradient(45deg, #1a1a1a, #2a2a2a)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                        }}>
                            <img
                                src={krishnenduImg}
                                alt="Krishnendu Karmakar"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'center top'
                                }}
                            />
                        </div>
                        <div style={{ padding: '2rem' }}>
                            <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Krishnendu Karmakar</h3>
                            <p style={{ color: 'var(--accent-color)', marginBottom: '1rem', fontWeight: '600' }}>Co-Founder</p>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.5 }}>
                                Emerging entrepreneur passionate to change the financial conditions of college students.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Contact Section */}
            <motion.section variants={itemVariants} style={{
                background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.1) 0%, rgba(5, 2, 11, 0) 100%)',
                padding: '3rem',
                borderRadius: '24px',
                textAlign: 'center',
                border: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
                <h2 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Get in Touch</h2>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '2rem',
                    marginBottom: '3rem'
                }}>
                    <a href="mailto:unixchangecampus@gmail.com" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.8rem',
                        color: 'var(--text-color)',
                        textDecoration: 'none',
                        padding: '1rem 2rem',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '50px',
                        transition: 'all 0.3s ease',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
                            e.currentTarget.style.borderColor = 'var(--primary-color)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                        }}
                    >
                        <Mail size={20} color="var(--accent-color)" />
                        <span style={{ fontSize: '1.1rem' }}>unixchangecampus@gmail.com</span>
                    </a>
                    <a href="tel:8584956548" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.8rem',
                        color: 'var(--text-color)',
                        textDecoration: 'none',
                        padding: '1rem 2rem',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '50px',
                        transition: 'all 0.3s ease',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
                            e.currentTarget.style.borderColor = 'var(--primary-color)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                        }}
                    >
                        <Phone size={20} color="var(--accent-color)" />
                        <span style={{ fontSize: '1.1rem' }}>8584956548</span>
                    </a>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                    <a href="https://www.instagram.com/unix.change/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                        <motion.div whileHover={{ scale: 1.2, color: '#E1306C' }} style={{ cursor: 'pointer' }}>
                            <Instagram size={32} />
                        </motion.div>
                    </a>
                    <motion.div whileHover={{ scale: 1.2, color: '#0077b5' }} style={{ cursor: 'pointer' }}>
                        <Linkedin size={32} />
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.2, color: '#1DA1F2' }} style={{ cursor: 'pointer' }}>
                        <Twitter size={32} />
                    </motion.div>
                </div>
            </motion.section>
        </motion.div>
    );
};

export default About;
