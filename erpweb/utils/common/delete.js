import { getFirestore, doc, deleteDoc } from 'firebase/firestore';

const deleteItem = async ({ collectionName, docId }, onSuccess, onError) => {
  try {
    if (!collectionName || !docId) {
      return console.error('no collection name or doc id');
    }

    const db = getFirestore();
    await deleteDoc(doc(db, collectionName, docId));
    onSuccess();
  } catch (err) {
    console.error(err);
    onError(err);
  }
};
export default deleteItem;
