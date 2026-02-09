/* Comment */

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only if config is valid
const isConfigValid = firebaseConfig.apiKey && firebaseConfig.apiKey !== 'undefined';

const app = getApps().length === 0
    ? (isConfigValid ? initializeApp(firebaseConfig) : null)
    : getApps()[0];

const auth = app ? getAuth(app) : {
    currentUser: null,
    onAuthStateChanged: () => () => { },
    signOut: async () => { },
} as any;

let analytics;
if (typeof window !== 'undefined') {
    import('firebase/analytics').then(({ getAnalytics }) => {
        analytics = getAnalytics(app);
    });
}

export { app, auth, analytics };

