import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => {
            // Prevent duplicate messages
            if (prev.some(t => t.message === message)) {
                return prev;
            }
            return [...prev, { id, message, type }];
        });

        // Auto remove after 3 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div style={{
                position: 'fixed',
                bottom: '24px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                alignItems: 'center',
                pointerEvents: 'none' // Allow clicks through container
            }}>
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        style={{
                            background: '#1e1e24',
                            color: '#fff',
                            padding: '10px 16px',
                            borderRadius: '50px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            minWidth: '300px',
                            pointerEvents: 'auto', // Re-enable clicks
                            cursor: 'default'
                        }}
                    >
                        {toast.type === 'success' && <CheckCircle size={18} color="#4ade80" />}
                        {toast.type === 'error' && <AlertCircle size={18} color="#ef4444" />}
                        {toast.type === 'info' && <Info size={18} color="#60a5fa" />}

                        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{toast.message}</span>

                        <button
                            onClick={() => removeToast(toast.id)}
                            style={{
                                marginLeft: 'auto',
                                background: 'transparent',
                                border: 'none',
                                color: '#a1a1aa',
                                cursor: 'pointer',
                                display: 'flex'
                            }}
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
