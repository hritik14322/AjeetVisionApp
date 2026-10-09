const admin = require('firebase-admin');

// Ensure you replace this with actual parsing in production
// Or load from a JSON file properly
let serviceAccount;

try {
  serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };

  if (serviceAccount.projectId && serviceAccount.privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin Initialized');
  } else {
    console.warn('Firebase config missing. Auth features will fail.');
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
}

module.exports = admin;
