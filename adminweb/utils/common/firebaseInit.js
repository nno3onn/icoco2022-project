import { getApps, initializeApp } from 'firebase/app';

const firebaseInit = () => {
  try {
    if (getApps.length === 0) {
      initializeApp({
        apiKey: process.env.apiKey,
        authDomain: process.env.authDomain,
        projectId: process.env.projectId,
        storageBucket: process.env.storageBucket,
        messagingSenderId: process.env.messagingSenderId,
        appId: process.env.appId,
        measurementId: process.env.measurementId,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

export default firebaseInit;
