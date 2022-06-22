/* eslint-disable object-curly-newline */
import { getFirestore, setDoc, doc } from 'firebase/firestore';

import storagePathConfigs from 'configs/storagePath';
import uploadFile from 'utils/uploads/upload';
import getYYMMDDHHMMSS from 'utils/format/getDocId';

const createNotice = async (info) => {
  try {
    if (!info) return console.error('no notice info');

    const { title = null, subtitle = null, contents = null, thumbnail = null } = info;

    const updated = { date: Date.now() };

    if (title) {
      updated.title = title;
    }
    if (subtitle) {
      updated.subtitle = subtitle;
    }
    if (contents) {
      updated.contents = contents;
    }
    if (thumbnail) {
      const url = await uploadFile(storagePathConfigs.noticeThumbnail, thumbnail);
      updated.thumbnail = url;
    }

    const db = getFirestore();
    const docId = getYYMMDDHHMMSS();
    await setDoc(doc(db, 'Notice', docId), updated);

    return docId;
  } catch (err) {
    console.error(err);
  }
};

export default createNotice;
