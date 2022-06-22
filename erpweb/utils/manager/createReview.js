/* eslint-disable object-curly-newline */
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import uploadFile from 'utils/uploads/upload';
import storagePath from 'configs/storagePath';

const createReview = async (info) => {
  try {
    if (!info) return 'no info';

    const {
      managerId = null,
      userName = null,
      type = null,
      specialtyItems = null,
      reviewRate = null,
      contents = null,
      thumbnails = null,
    } = info;

    const auth = getAuth();
    const companyId = auth.currentUser.uid;
    const date = Date.now();

    const updated = {
      companyId,
      managerId,
      userName,
      type,
      specialtyItems,
      contents,
      thumbnails,
      date,
    };

    if (reviewRate) {
      updated.reviewRate = reviewRate;
    }

    if (thumbnails) {
      if (thumbnails.length) {
        const urls = await Promise.all(
          thumbnails.map(async (file) => {
            const result = await uploadFile(storagePath.review, file.file);
            return result;
          }),
        );
        updated.thumbnails = urls;
      }
    }

    const db = getFirestore();
    await setDoc(doc(db, 'Review', String(date)), updated);
    console.log(7);
    return date;
  } catch (err) {
    console.error(err);
    alert('다시 시도해주세요.');
  }
};

export default createReview;
