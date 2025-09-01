'use server';
import * as admin from 'firebase-admin';

// This is a more robust way to initialize firebase-admin in Next.js server environments.
// It prevents re-initialization errors by storing the initialized app in a global variable.
const getFirebaseAdmin = () => {
    if (admin.apps.length > 0) {
        return admin.apps[0]!;
    }
    try {
        return admin.initializeApp({
            credential: admin.credential.applicationDefault(),
        });
    } catch (error) {
        console.error('Firebase admin initialization error', error);
        // We re-throw the error to make it clear that something is wrong with the setup.
        throw error;
    }
};

function getDb() {
    return getFirebaseAdmin().firestore();
}

export { getDb };
