/* Comment */

'use client';

import { useSync } from '../hooks/useSync';
import { WifiOff, RefreshCw } from 'lucide-react';

export default function OfflineIndicator() {
    const { isOnline, isSyncing } = useSync();

    if (isOnline && !isSyncing) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
            {!isOnline && (
                <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom duration-300">
                    <WifiOff size={18} />
                    <span className="text-sm font-medium">You appear to be offline</span>
                </div>
            )}

            {isSyncing && (
                <div className="bg-[var(--accent-green)] text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom duration-300">
                    <RefreshCw size={18} className="animate-spin" />
                    <span className="text-sm font-medium">Syncing data...</span>
                </div>
            )}
        </div>
    );
}
