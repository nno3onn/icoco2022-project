/* eslint-disable object-curly-newline */
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const countReservation = async () => {
  const db = getFirestore();
  const ref = collection(db, 'Reservation');

  const auth = getAuth();
  const { uid } = auth.currentUser;

  const result = { 전체: 0 };
  const statusType = ['예약출산일미확정', '예약출산일확정', '파견중', '서비스취소', '서비스종료'];

  await Promise.all(
    statusType.map(async (type) => {
      const q = query(
        ref,
        where('chosenCompany', '==', uid),
        where('status', '==', type),
        where('userStep', '>=', 3),
      );
      const querySnapShot = await getDocs(q);
      const count = querySnapShot.size;

      result[type] = count;
      result['전체'] += count;
    }),
  );
  return result;
};

export default countReservation;
