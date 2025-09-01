'use server';
import * as admin from 'firebase-admin';

let db: admin.firestore.Firestore;

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

db = admin.firestore();

export { db };
