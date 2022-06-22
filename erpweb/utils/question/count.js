/* eslint-disable object-curly-newline */
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const countQuestion = async () => {
  const db = getFirestore();
  const ref = collection(db, 'Question');

  const auth = getAuth();
  const { uid } = auth.currentUser;

  const result = {};
  let total = 0;

  await Promise.all(
    ['답변완료', '답변대기중'].map(async (type) => {
      const q = query(
        ref,
        where('companyId', '==', uid),
        where('isAnswered', '==', type === '답변완료'),
      );
      const querySnapShot = await getDocs(q);
      const count = querySnapShot.size;

      result[type] = count;
      total += count;
    }),
  );
  result['전체'] = total;
  return result;
};

export default countQuestion;
