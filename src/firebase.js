// This module is only ever imported (dynamically) by
// src/pages/tools/shopping-list/PrivateList.jsx — which itself is
// React.lazy()-loaded from ShoppingList.jsx. That means Firebase is never
// fetched, bundled-in-the-critical-path, or initialized unless someone is
// actually on the private /shopping-list/<id> route.
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

let cached = null

export function getFirebase() {
  if (cached) return cached
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
  cached = {
    app,
    auth: getAuth(app),
    db: getFirestore(app),
  }
  return cached
}
