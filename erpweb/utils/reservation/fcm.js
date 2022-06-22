import { getAuth } from 'firebase/auth';
import { getFirestore, getDoc, doc } from 'firebase/firestore';

const sendFCM = async ({ email }) => {
  try {
    const token = await getAuth().currentUser.getIdToken();

    const db = getFirestore();
    const docRef = doc(db, 'User', email);
    const docSnap = await getDoc(docRef);

    const { fcm, pushAlarm } = docSnap.data();
    if (!pushAlarm) return false;
    if (!fcm) return console.error('no fcm in user');

    const url = '/api/sendFCM';
    const options = {
      method: 'POST',
      headers: {
        'x-access-token': token,
      },
      body: fcm,
    };

    const res = await fetch(url, options);
    const { error } = await res.json();
    if (error) console.error(error);
  } catch (err) {
    console.error(err);
  }
};

export default sendFCM;
