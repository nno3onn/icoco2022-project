import { getFirestore, doc, getDoc } from 'firebase/firestore';

const showItem = async ({ collectionName, docId }, onSuccess, onError) => {
  try {
    if (!collectionName || !docId) return console.error('no collection name or doc id');
    const db = getFirestore();
    const docRef = doc(db, collectionName, docId);
    const document = await getDoc(docRef);

    if (!document.exists()) return alert('해당 이벤트 정보를 찾을 수 없습니다.');
    const info = document.data();
    onSuccess(info);
  } catch (err) {
    console.error(err);
    onError(err);
  }
};

export default showItem;
