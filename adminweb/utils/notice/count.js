/* eslint-disable object-curly-newline */
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const countNotice = async (setter) => {
  try {
    const db = getFirestore();
    const querySnapShot = await getDocs(collection(db, 'Notice'));

    if (!querySnapShot) return setter(0);

    const count = querySnapShot.size;
    return setter(count);
  } catch (err) {
    console.error(err);
    return setter(0);
  }
};

export default countNotice;
