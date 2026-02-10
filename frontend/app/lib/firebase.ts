import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, setPersistence, browserLocalPersistence } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only if config is valid and not placeholders
const isConfigValid = Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== 'undefined' &&
    !firebaseConfig.apiKey.includes('xxxxx') &&
    !firebaseConfig.projectId?.includes('xxxxx')
);


const app = getApps().length === 0
    ? (isConfigValid ? initializeApp(firebaseConfig) : undefined)
    : getApps()[0];

const auth = app ? getAuth(app) : null;

// Enable persistence
if (auth) {
    setPersistence(auth, browserLocalPersistence).catch((error) => {
        console.error("Error setting auth persistence:", error);
    });
}

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
    if (!auth) return;
    try {
        await signInWithPopup(auth, googleProvider);
    } catch (error) {
        console.error("Error signing in", error);
    }
};

const logout = async () => {
    if (auth) {
        await signOut(auth);
    }
};

export { app, auth, signInWithGoogle, logout };

