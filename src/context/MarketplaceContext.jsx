import React, { createContext, useContext, useState, useEffect } from 'react';

const MarketplaceContext = createContext();

export const useMarketplace = () => useContext(MarketplaceContext);

const initialItems = [];

export const MarketplaceProvider = ({ children }) => {
    const [products, setProducts] = useState([]); // Start empty

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    setProducts(data);
                }
            }
        } catch (err) {
            console.error("Failed to fetch products", err);
        }
    };

    // seedInitialProducts removed for production/practical usage

    useEffect(() => {
        fetchProducts();
    }, []);

    const [reels, setReels] = useState([]);

    const fetchReels = async () => {
        try {
            const response = await fetch('/api/reels');
            if (response.ok) {
                const data = await response.json();
                setReels(data);
            } else {
                console.error("Failed to fetch reels");
                // Fallback to empty or keep previous state
            }
        } catch (error) {
            console.error("Error fetching reels:", error);
        }
    };

    useEffect(() => {
        fetchReels(); // Initial fetch

        // Polling (Optional: for demo purposes to see new uploads)
        const interval = setInterval(fetchReels, 10000);
        return () => clearInterval(interval);
    }, []);

    // Note: We are no longer syncing to localStorage as primary source of truth for reels
    // to avoid conflict with backend IDs vs local IDs.

    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) setOrders(data);
            }
        } catch (err) {
            console.error("Failed to fetch orders", err);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const addOrder = async (orderData) => {
        // Optimistic
        const newOrder = { ...orderData, status: 'Pending', date: new Date() };
        setOrders(prev => [newOrder, ...prev]);

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });
            if (res.ok) {
                const savedOrder = await res.json();
                setOrders(prev => prev.map(o => o === newOrder ? savedOrder : o));
            }
        } catch (err) {
            console.error("Failed to create order", err);
        }
    };

    const addProduct = async (product) => {
        const newProduct = {
            rating: 0,
            reviews: 0,
            seller: product.seller || "You",
            sellerEmail: product.sellerEmail, // Robust linking
            status: "Active",
            ...product
        };

        // Optimistic update
        setProducts(prev => [newProduct, ...prev]);

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct)
            });
            if (res.ok) {
                const savedProduct = await res.json();
                // Replace optimistic item with real one (with _id)
                setProducts(prev => prev.map(p => p === newProduct ? savedProduct : p));
            }
        } catch (err) {
            console.error("Failed to add product", err);
        }
    };

    const addReel = (reel) => {
        // optimistic update or just trigger refresh
        setReels(prev => [reel, ...prev]);
        fetchReels(); // Ensure sync with server
    };

    const updateProduct = (id, updatedData) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
    };

    const updateOrderStatus = (orderId, newStatus) => {
        setOrders(prev => prev.map(order =>
            (order._id === orderId || order.id === orderId) ? { ...order, status: newStatus } : order
        ));
    };

    const deleteProduct = async (id) => {
        setProducts(prev => prev.filter(p => p._id !== id && p.id !== id)); // Handle both _id (mongo) and id (local legacy)

        try {
            // Assume we only delete items that have a real _id (synced to server)
            if (typeof id === 'string' && id.length > 10) { // Simple check for Mongo ID
                await fetch(`/api/products/${id}`, { method: 'DELETE' });
            }
        } catch (err) {
            console.error("Failed to delete product", err);
        }
    };

    const deleteReel = async (id, userId) => {
        // Optimistic update
        setReels(prev => prev.filter(r => r._id !== id));

        try {
            await fetch(`/api/reels/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userId || 'demo_user' }) // Pass the actual userId, fallback to demo if missing
            });
        } catch (error) {
            console.error("Failed to delete reel from server", error);
            // Optionally revert: fetchReels();
        }
    };

    const value = {
        products,
        reels,
        orders,
        addProduct,
        addReel,
        deleteReel, // Exported
        updateProduct,
        updateOrderStatus,
        deleteProduct,
        fetchReels,
        addOrder
    };

    return (
        <MarketplaceContext.Provider value={value}>
            {children}
        </MarketplaceContext.Provider>
    );
};
