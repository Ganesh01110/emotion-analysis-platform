'use client';

import { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth) {
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const getDisplayName = () => {
        if (!user) {
            // Check if we are in a local environment without Firebase config
            if (auth === null) return 'Local Developer';
            return 'User';
        }
        if (user.displayName) return user.displayName;
        if (user.email) return user.email.split('@')[0];
        return 'User';
    };

    const getInitials = () => {
        const name = getDisplayName();
        return name.charAt(0).toUpperCase();
    };

    const getProfilePic = () => {
        return user?.photoURL || null;
    };

    const getToken = async () => {
        if (!user) {
            // If auth is null, we are in local dev fallback mode
            if (auth === null) return 'local-dev-token';
            return null;
        }
        return await user.getIdToken();
    };

    const logout = async () => {
        if (!auth) return;
        try {
            await auth.signOut();
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const isLocalDev = auth === null;

    return { user, loading, getDisplayName, getInitials, getProfilePic, getToken, logout, isLocalDev };
}
