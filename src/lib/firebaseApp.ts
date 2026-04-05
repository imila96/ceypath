import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

/** All six Web SDK fields from Firebase console → Project settings → Your apps. */
export function isFirebaseConfigured(): boolean {
  const e = import.meta.env;
  return Boolean(
    e.VITE_FIREBASE_API_KEY?.trim() &&
      e.VITE_FIREBASE_AUTH_DOMAIN?.trim() &&
      e.VITE_FIREBASE_PROJECT_ID?.trim() &&
      e.VITE_FIREBASE_STORAGE_BUCKET?.trim() &&
      e.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim() &&
      e.VITE_FIREBASE_APP_ID?.trim()
  );
}

let app: FirebaseApp | undefined;

export function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase env vars are not set (VITE_FIREBASE_*).');
  }
  if (!app) {
    app = getApps()[0] ?? initializeApp({
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY!,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN!,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID!,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET!,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID!,
      appId: import.meta.env.VITE_FIREBASE_APP_ID!,
    });
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}

export function getFirebaseDb(): Firestore {
  return getFirestore(getFirebaseApp());
}
