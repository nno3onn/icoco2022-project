/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-newline */
import { getAuth } from 'firebase/auth';
import client from 'utils/common/initAlgolia';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const getQuestionList = async ({ filter, offset }, onSuccess, onError) => {
  try {
    const { uid } = getAuth().currentUser;

    const index = client.initIndex('question');
    const so = { length: 8, offset: Number(offset) };
    so.filters =
      filter === '전체'
        ? `companyId:${uid}`
        : `isAnswered:${filter === '답변 완료'} AND companyId:${uid}`;

    const { hits } = await index.search('', so);

    const res = await Promise.all(
      hits.map(async (rsv) => {
        const { userEmail } = rsv;

        if (userEmail) {
          const db = getFirestore();
          const docRef = doc(db, 'User', userEmail);
          const userDoc = await getDoc(docRef);

          if (!userDoc.exists()) return { ...rsv };

          const { name } = userDoc.data();

          return { ...rsv, userName: name };
        }
      }),
    );

    onSuccess(res);
  } catch (err) {
    console.error(err);
    onError(err);
  }
};

export default getQuestionList;
