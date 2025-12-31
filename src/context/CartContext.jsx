import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const stored = localStorage.getItem('unixchange_cart');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Migration: Replace $ with ₹ in existing cart items
                return parsed.map(item => ({
                    ...item,
                    price: item.price.replace('$', '₹')
                }));
            } catch (error) {
                return [];
            }
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem('unixchange_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const decreaseQuantity = (productId) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === productId);
            if (existing) {
                if (existing.quantity === 1) {
                    return prev.filter(item => item.id !== productId);
                }
                return prev.map(item =>
                    item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
                );
            }
            return prev;
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(item => item.id !== productId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, decreaseQuantity, removeFromCart, clearCart, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};
