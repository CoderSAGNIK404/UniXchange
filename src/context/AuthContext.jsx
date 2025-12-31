import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for logged in user on mount
        const storedUser = localStorage.getItem('unixchange_current_user');
        const lastActive = localStorage.getItem('unixchange_last_active');

        // Session Duration: 30 days (Satisfies "at least one week" requirement)
        const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

        if (storedUser) {
            const isExpired = lastActive && (Date.now() - parseInt(lastActive, 10) > SESSION_DURATION_MS);

            if (isExpired) {
                // Session expired
                localStorage.removeItem('unixchange_current_user');
                localStorage.removeItem('unixchange_last_active');
            } else {
                // Session valid or first run with this feature
                try {
                    setUser(JSON.parse(storedUser));
                    // Update last active time
                    localStorage.setItem('unixchange_last_active', Date.now().toString());
                } catch (error) {
                    console.error("Failed to parse user data:", error);
                    localStorage.removeItem('unixchange_current_user');
                    localStorage.removeItem('unixchange_last_active');
                }
            }
        }
        setLoading(false);
    }, []);

    // Simulate Database Operations
    const getUsers = () => {
        const users = localStorage.getItem('unixchange_users');
        try {
            return users ? JSON.parse(users) : [];
        } catch (error) {
            console.error("Failed to parse users:", error);
            return [];
        }
    };

    const saveUserToDB = (newUser) => {
        const users = getUsers();
        users.push(newUser);
        localStorage.setItem('unixchange_users', JSON.stringify(users));
    };

    const signup = async (name, email, password, storeName = '') => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = getUsers();
                const existingUser = users.find(u => u.email === email);

                if (existingUser) {
                    reject('User already exists with this email.');
                    return;
                }

                const newUser = {
                    id: Date.now().toString(),
                    name,
                    email,
                    password, // In a real app, hash this!
                    storeName, // New field
                    joinedAt: new Date().toISOString()
                };

                saveUserToDB(newUser);

                // Auto login after signup
                localStorage.setItem('unixchange_current_user', JSON.stringify(newUser));
                localStorage.setItem('unixchange_last_active', Date.now().toString());
                setUser(newUser);
                resolve(newUser);
            }, 800); // Simulate network delay
        });
    };

    const login = async (email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = getUsers();
                const foundUser = users.find(u => u.email === email && u.password === password);

                if (foundUser) {
                    localStorage.setItem('unixchange_current_user', JSON.stringify(foundUser));
                    localStorage.setItem('unixchange_last_active', Date.now().toString());
                    setUser(foundUser);
                    resolve(foundUser);
                } else {
                    reject('Invalid email or password.');
                }
            }, 800);
        });
    };

    const logout = () => {
        localStorage.removeItem('unixchange_current_user');
        localStorage.removeItem('unixchange_last_active');
        setUser(null);
    };

    const updateUser = async (updatedData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const updatedUser = { ...user, ...updatedData };

                // Update current state
                setUser(updatedUser);
                localStorage.setItem('unixchange_current_user', JSON.stringify(updatedUser));

                // Update in "DB"
                const users = getUsers();
                const userIndex = users.findIndex(u => u.id === user.id);
                if (userIndex !== -1) {
                    users[userIndex] = updatedUser;
                    localStorage.setItem('unixchange_users', JSON.stringify(users));
                }

                resolve(updatedUser);
            }, 500);
        });
    };

    const toggleFavorite = async (item) => {
        if (!user) return;

        const currentFavorites = user.favorites || [];
        const isFavorite = currentFavorites.some(fav => fav.id === item.id);

        let newFavorites;
        if (isFavorite) {
            newFavorites = currentFavorites.filter(fav => fav.id !== item.id);
        } else {
            newFavorites = [...currentFavorites, item];
        }

        await updateUser({ favorites: newFavorites });
    };

    const changePassword = async (currentPassword, newPassword) => {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                if (user.password !== currentPassword) {
                    reject('Incorrect current password.');
                    return;
                }

                await updateUser({ password: newPassword });
                resolve();
            }, 800);
        });
    };

    const value = {
        user,
        signup,
        login,
        logout,
        updateUser,
        toggleFavorite,
        changePassword,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
