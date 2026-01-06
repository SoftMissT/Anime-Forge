// lib/server/firebaseAdmin.ts
import * as admin from 'firebase-admin';

let firestore: admin.firestore.Firestore | null = null;
let firebaseInitializationError: string | null = null;

// Evita a re-inicialização em ambientes de desenvolvimento (hot-reloading)
if (!admin.apps.length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
        throw new Error('As variáveis de ambiente do Firebase (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) não estão configuradas.');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
    firestore = admin.firestore();
    console.log('Firebase Admin SDK inicializado com sucesso.');
  } catch (error: any) {
    firebaseInitializationError = error.message;
    console.error('Erro ao inicializar Firebase Admin SDK:', firebaseInitializationError);
  }
} else {
    firestore = admin.firestore();
}

export { firestore, firebaseInitializationError };
