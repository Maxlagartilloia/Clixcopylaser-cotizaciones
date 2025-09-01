'use server';
import * as admin from 'firebase-admin';

function getDb() {
    if (!admin.apps.length) {
        try {
            admin.initializeApp({
                credential: admin.credential.applicationDefault(),
            });
        } catch (error) {
            console.error('Firebase admin initialization error', error);
        }
    }
    return admin.firestore();
}

export { getDb };
