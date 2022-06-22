/* eslint-disable operator-linebreak */
/* eslint-disable indent */
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const showQuestion = async (docId, onSuccess) => {
  try {
    const db = getFirestore();
    const docRef = doc(db, 'Question', docId);
    const document = await getDoc(docRef);
    const info = document.data();

    if (!info) return;

    const { userEmail } = info;

    if (userEmail) {
      const ref = doc(db, 'User', userEmail);
      const userDoc = await getDoc(ref);
      if (!userDoc.exists()) return onSuccess(info);

      const { name, phone } = userDoc.data();
      info.userName = name;
      info.phone =
        phone.length === 11
          ? `${phone.substring(0, 3)}-${phone.substring(3, 7)}-${phone.substring(7, 11)}`
          : phone.length === 10
          ? `${phone.substring(0, 3)}-${phone.substring(3, 6)}-${phone.substring(6, 10)}`
          : phone;
    }

    return onSuccess(info);
  } catch (err) {
    console.error(err);
  }
};

export default showQuestion;
