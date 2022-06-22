import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
} from 'firebase/firestore';

const getListOrderBy = async (
  { collectionName, targetOrder, desc = false },
  setter,
  onError,
) => {
  try {
    if (!collectionName || !targetOrder) {
      return console.error('no collection name or target');
    }

    const itemList = [];

    const db = getFirestore();
    const docsRef = collection(db, collectionName);
    const q = query(
      docsRef,
      desc ? orderBy(targetOrder, 'desc') : orderBy(targetOrder),
    );

    const docs = await getDocs(q);
    docs.forEach((doc) => {
      const docInfo = doc.data();
      docInfo.id = doc.id;
      itemList.push(docInfo);
    });

    setter(itemList);
  } catch (err) {
    console.error(err);
    onError(err);
  }
};

export default getListOrderBy;
