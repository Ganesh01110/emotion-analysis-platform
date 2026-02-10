/* Comment */

'use client';

import { useState, useEffect } from 'react';

export function useSync() {
    const [isOnline, setIsOnline] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        // Check initial online status
        setIsOnline(navigator.onLine);

        // Listen for online/offline events
        const handleOnline = () => {
            setIsOnline(true);
            syncPendingData();
        };

        const handleOffline = () => {
            setIsOnline(false);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const syncPendingData = async () => {
        setIsSyncing(true);

        try {
            // Get pending thoughts from IndexedDB
            const { openDB } = await import('idb');
            const db = await openDB('emotion-analysis', 1, {
                upgrade(db) {
                    if (!db.objectStoreNames.contains('offline_thoughts')) {
                        db.createObjectStore('offline_thoughts', { keyPath: 'id', autoIncrement: true });
                    }
                },
            });

            const tx = db.transaction('offline_thoughts', 'readonly');
            const store = tx.objectStore('offline_thoughts');
            const pendingThoughts = await store.getAll();

            // Sync each thought
            for (const thought of pendingThoughts) {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analyze`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            text: thought.text,
                            agent_mode: thought.agent_mode || 'analytical',
                        }),
                    });

                    if (response.ok) {
                        // Remove from IndexedDB after successful sync
                        const deleteTx = db.transaction('offline_thoughts', 'readwrite');
                        const deleteStore = deleteTx.objectStore('offline_thoughts');
                        await deleteStore.delete(thought.id);
                    }
                } catch (error) {
                    console.error('Error syncing thought:', error);
                }
            }
        } catch (error) {
            console.error('Error during sync:', error);
        } finally {
            setIsSyncing(false);
        }
    };

    return { isOnline, isSyncing, syncPendingData };
}

