import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const getUnread = async () => {
  try {
    const { uid } = getAuth().currentUser;
    if (!uid) return console.error('no company id');

    const db = getFirestore();
    const docRef = doc(db, 'Company', uid);
    const document = await getDoc(docRef);
    const info = document.data();

    if (!info) return console.error('no data');

    const { unReadReservation, unReadQuestion } = info;
    return { unReadReservation, unReadQuestion };
  } catch (err) {
    console.error(err);
  }
};

export default getUnread;
