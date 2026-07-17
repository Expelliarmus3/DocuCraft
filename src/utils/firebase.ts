// Polyfill crypto.randomUUID for non-secure contexts (like local network IPs)
if (typeof window !== 'undefined' && window.crypto && !window.crypto.randomUUID) {
  Object.defineProperty(window.crypto, 'randomUUID', {
    value: function () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
    writable: true,
    configurable: true
  });
}



import { initializeApp, getApp, getApps } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider, getToken } from 'firebase/app-check';

// Firebase configuration keys (supports fallbacks or environment definitions)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'mock-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: any;

// Helper to initialize or retrieve Firebase App
export function getFirebaseApp() {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  return app;
}

let appCheckInstance: any = null;

// Dynamic client-side initialization of Firebase App Check
export function initAppCheck() {
  if (typeof window === 'undefined') {
    return null;
  }
  
  if (appCheckInstance) {
    return appCheckInstance;
  }

  // Support App Check Debug Token in local development
  if (process.env.NODE_ENV === 'development') {
    (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = 
      process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_DEBUG_TOKEN || true;
  }

  try {
    const firebaseApp = getFirebaseApp();
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6Ld_your_fallback_recaptcha_site_key';
    
    appCheckInstance = initializeAppCheck(firebaseApp, {
      provider: new ReCaptchaV3Provider(siteKey),
      isTokenAutoRefreshEnabled: true,
    });
    return appCheckInstance;
  } catch (err) {
    console.warn('⚠️ Firebase App Check initialization skipped or failed:', err);
    return null;
  }
}

// Function to fetch the current App Check token
export async function getAppCheckToken(): Promise<string | null> {
  const appCheck = initAppCheck();
  if (!appCheck) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Firebase App Check not initialized. Using local dev bypass token.');
      return 'local-dev-bypass-token';
    }
    return null;
  }
  try {
    const result = await getToken(appCheck, false);
    return result.token;
  } catch (err) {
    console.error('❌ Failed to retrieve App Check token:', err);
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Falling back to local dev bypass token due to token retrieval error.');
      return 'local-dev-bypass-token';
    }
    return null;
  }
}
