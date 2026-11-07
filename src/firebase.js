import { initializeApp, getApp, getApps } from "firebase/app";

import {
  initializeAuth,
  getAuth,
  GoogleAuthProvider,
  browserLocalPersistence,
  browserPopupRedirectResolver,
} from "firebase/auth";

console.log("========== FIREBASE DEBUG START ==========");

const firebaseConfig = {
  apiKey: "AIzaSyAWFHYipBiD2ZPI9Dk965mmFxHgemNquek",
  authDomain: "hbplus-web-1fe73.firebaseapp.com",
  projectId: "hbplus-web-1fe73",
  storageBucket: "hbplus-web-1fe73.firebasestorage.app",
  messagingSenderId: "330396494152",
  appId: "1:330396494152:web:3a35cc4f2ea5e62faa6b7d",
};

let app;

try {
  console.log("[1] Checking Firebase apps...");

  app = getApps().length ? getApp() : initializeApp(firebaseConfig);

  console.log("[2] Firebase app initialized:", app.name);
  console.log("[3] Firebase project ID:", app.options.projectId);
} catch (error) {
  console.error("[FIREBASE APP ERROR]", error);
  throw error;
}

let auth;

try {
  console.log("[4] Initializing Firebase Auth...");

  auth = initializeAuth(app, {
    persistence: browserLocalPersistence,
    popupRedirectResolver: browserPopupRedirectResolver,
  });

  console.log("[5] Firebase Auth initialized successfully");
} catch (error) {
  console.warn("[AUTH INITIALIZATION WARNING]", error.code, error.message);

  try {
    auth = getAuth(app);
    console.log("[6] Existing Firebase Auth instance reused");
  } catch (authError) {
    console.error("[FIREBASE AUTH ERROR]", authError);
    throw authError;
  }
}

export { auth };

export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

console.log("[7] Auth exists:", !!auth);
console.log("[8] Auth app name:", auth?.app?.name);
console.log("[9] Google Provider exists:", !!googleProvider);

console.log("========== FIREBASE DEBUG END ==========");