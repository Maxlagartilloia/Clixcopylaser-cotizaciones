import * as admin from 'firebase-admin';

// Check if the app is already initialized to prevent errors
if (!admin.apps.length) {
  try {
    // Using applicationDefault() is the standard way in many environments
    // like Google Cloud Run, Cloud Functions, etc.
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
    // In a local development environment, you might need to specify the service account key file
    // For example, by setting the GOOGLE_APPLICATION_CREDENTIALS environment variable
  }
}

// Export the firestore instance
export const db = admin.firestore();
