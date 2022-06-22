import { getFirestore, collection, getDocs } from 'firebase/firestore';

const getList = async (collectionName, setter, onError) => {
  try {
    if (!collectionName || !setter) {
      return console.error('No collection name or setter');
    }

    const db = getFirestore();
    const docs = await getDocs(collection(db, collectionName));

    const itemList = [];
    docs.forEach((doc) => {
      const item = doc.data();
      item.id = doc.id;
      itemList.push(item);
    });
    setter(itemList);
  } catch (err) {
    console.error(err);
    onError(err);
  }
};

export default getList;
