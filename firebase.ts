// firebase.ts
import { initializeApp, FirebaseApp } from 'firebase/app';
import { RemoteConfig, getRemoteConfig, fetchAndActivate, getValue, RemoteConfigSettings } from 'firebase/remote-config';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};


let remoteConfig: RemoteConfig | undefined;

if (typeof window !== 'undefined') {
  // Initialize Firebase
  const app: FirebaseApp = initializeApp(firebaseConfig);

  // Initialize Remote Config
  remoteConfig = getRemoteConfig(app);
  remoteConfig.settings = {
    minimumFetchIntervalMillis: 3600000, // 1 hour
    fetchTimeoutMillis: 60000 // 1 minute
  } as RemoteConfigSettings;
}

export { remoteConfig, fetchAndActivate, getValue };