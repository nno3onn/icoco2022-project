import { getAuth } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

const resetUnRead = async ({ type }) => {
  try {
    if (!type) return console.error('no type');

    const { uid } = getAuth().currentUser;
    if (!uid) return console.error('no company id');

    const updated = {};
    if (type === 'reservation') {
      updated.unReadReservation = 0;
    }
    if (type === 'question') {
      updated.unReadQuestion = 0;
    }

    const db = getFirestore();
    const docRef = doc(db, 'Company', uid);
    await updateDoc(docRef, updated);
  } catch (err) {
    console.error(err);
  }
};

export default resetUnRead;
