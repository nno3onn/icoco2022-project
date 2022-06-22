import { getFirestore, doc, getDoc } from 'firebase/firestore';

const showItem = async ({ collectionName, docId }, onSuccess) => {
  try {
    const db = getFirestore();
    const docRef = doc(db, collectionName, docId);
    const document = await getDoc(docRef);
    const info = document.data();

    if (!info) return;

    return onSuccess(info);
  } catch (err) {
    console.error(err);
  }
};

export default showItem;
