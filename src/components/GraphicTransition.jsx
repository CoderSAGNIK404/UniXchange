import React from 'react';
import { motion } from 'framer-motion';

const GraphicTransition = () => {
    const bars = 5; // Number of bars

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {[...Array(bars)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1, originX: 0 }}
                    exit={{ scaleX: 0, originX: 1 }}
                    transition={{
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                        delay: i * 0.1
                    }}
                    style={{
                        flex: 1,
                        width: '100%',
                        background: '#4f46e5',
                        borderBottom: '1px solid rgba(255,255,255,0.1)'
                    }}
                />
            ))}

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '4rem',
                    fontWeight: '800',
                    zIndex: 10000,
                    background: 'linear-gradient(to right, #e9d5ff, #c084fc, #7e22ce)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))',
                    letterSpacing: '-0.02em'
                }}
            >
                UniXchange
            </motion.div>
        </div>
    );
};

export default GraphicTransition;
