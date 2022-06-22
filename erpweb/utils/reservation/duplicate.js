import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const checkDuplication = async ({ userName, phone, moreThanNumber }) => {
  try {
    if (!userName || !phone) return null;

    const db = getFirestore();
    const ref = collection(db, 'Reservation');
    const q = query(
      ref,
      where('phone', '==', phone),
      where('userName', '==', userName),
      where('status', '!=', '서비스종료'),
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot) return;

    const ck = querySnapshot.size >= moreThanNumber;
    if (ck === false) return { ck, id: null };

    const id = querySnapshot.docs.map((doc) => doc.id);

    return { ck, id };
  } catch (err) {
    console.error(err);
  }
};

export default checkDuplication;
