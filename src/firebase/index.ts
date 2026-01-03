      'use client';
      
      import { firebaseConfig } from '@/firebase/config';
      import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
      import { getAuth } from 'firebase/auth';
      import { getFirestore } from 'firebase/firestore';
      import { getFunctions } from 'firebase/functions';
      
      // IMPORTANT: DO NOT MODIFY THIS FUNCTION
      export function initializeFirebase() {
       if (!getApps().length) {
              // Guard: fail fast with a clear error when the public API key is missing.
              if (!firebaseConfig || !firebaseConfig.apiKey) {
                // Log a helpful message for local development
                // eslint-disable-next-line no-console
                console.error('Missing NEXT_PUBLIC_FIREBASE_API_KEY. Add it to .env.local and restart dev server.');
                throw new Error('Missing NEXT_PUBLIC_FIREBASE_API_KEY. See README or add .env.local with NEXT_PUBLIC_FIREBASE_API_KEY.');
              }

              return getSdks(initializeApp(firebaseConfig));
       }
     
       // If already initialized, return the SDKs with the already initialized App
       return getSdks(getApp());
     }
     
     export function getSdks(firebaseApp: FirebaseApp) {
       return {
         firebaseApp,
         auth: getAuth(firebaseApp),
         firestore: getFirestore(firebaseApp),
         functions: getFunctions(firebaseApp),
       };
     }
     
     export * from './provider';
     export * from './client-provider';
     export * from './firestore/use-collection';
     export * from './firestore/use-doc';
     export * from './non-blocking-updates';
     export * from './non-blocking-login';
     export * from './errors';
     export * from './error-emitter';
