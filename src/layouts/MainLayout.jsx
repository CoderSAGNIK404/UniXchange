import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ChatWidget from '../components/ChatWidget';
import { motion, AnimatePresence } from 'framer-motion';
import GraphicTransition from '../components/GraphicTransition';

const MainLayout = () => {
    const [userType, setUserType] = useState('buyer');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFilter, setSearchFilter] = useState('All');
    const [isTransitioning, setIsTransitioning] = useState(false);
    const navigate = useNavigate();

    const toggleUserType = () => {
        if (isTransitioning) return;

        setIsTransitioning(true);

        // Wait for bars to cover (approx 800ms total animation time)
        // Bars enter: 0.5s + 0.4s delay = 0.9s max
        // Let's switch halfway through
        setTimeout(() => {
            setUserType(prev => prev === 'buyer' ? 'seller' : 'buyer');
            // Navigate to home (Dashboard for Seller, Home for Buyer)
            navigate('/app');

            setTimeout(() => {
                setIsTransitioning(false);
            }, 800);
        }, 800);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ minHeight: '100vh', background: 'var(--bg-color)' }}
        >
            <Navbar
                userType={userType}
                toggleUserType={toggleUserType}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchFilter={searchFilter}
                setSearchFilter={setSearchFilter}
            />
            <div style={{ display: 'flex' }}>
                <Sidebar userType={userType} />
                <main style={{ flex: 1, overflowY: 'auto', height: 'calc(100vh - 73px)' }}>
                    <Outlet context={{ searchQuery, searchFilter, userType }} />
                    <ChatWidget />
                </main>
            </div>

            <AnimatePresence>
                {isTransitioning && <GraphicTransition />}
            </AnimatePresence>
        </motion.div>
    );
};

export default MainLayout;
