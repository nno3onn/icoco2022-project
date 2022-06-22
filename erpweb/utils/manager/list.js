/* eslint-disable object-curly-newline */
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import filterAge from './filter/age';
import filterCareerYear from './filter/careerYear';
import filterStatus from './filter/status';

const getManagerList = async (filter, onSuccess, onError = null) => {
  try {
    const auth = getAuth();
    const { uid } = auth.currentUser;

    const db = getFirestore();
    const docRef = collection(db, 'Manager');
    const docs = await getDocs(query(docRef, where('company', '==', uid)));
    const list = docs.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    if (filter) {
      const { status, careerStarted, birth } = filter;
      const statusList = filterStatus(status, list);
      const careerList = filterCareerYear(careerStarted, statusList);
      const ageList = filterAge(birth, careerList);
      const managerList = ageList
        .filter((manager) => manager !== undefined)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      onSuccess(managerList);
    } else {
      onSuccess(list);
    }
  } catch (err) {
    console.error(err);
    onError(err);
  }
};
export default getManagerList;
