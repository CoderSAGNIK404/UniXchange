import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import BuyerHome from './BuyerHome';
import SellerHome from './SellerHome';

const Home = () => {
    const { userType } = useOutletContext();

    return (
        <AnimatePresence mode="wait">
            {userType === 'seller' ? (
                <motion.div
                    key="seller"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <SellerHome />
                </motion.div>
            ) : (
                <motion.div
                    key="buyer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                >
                    <BuyerHome />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Home;
