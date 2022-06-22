import { getFirestore, doc, setDoc } from 'firebase/firestore';

import storagePathConfigs from 'configs/storagePath';
import uploadFile from 'utils/uploads/upload';
import getYYMMDDHHMMSS from 'utils/format/getDocId';

const createTip = async (tipInfo) => {
  try {
    if (!tipInfo) return console.error('no tip info');

    const {
      title = null,
      authorId = null,
      profileImage = null,
      thumbnails = null,
      contents = null,
      keyword = null,
    } = tipInfo;

    if (!authorId) console.error('no author id');

    const updated = { date: Date.now() };
    if (authorId) {
      updated.authorId = authorId;
    }
    if (profileImage) {
      const url = await uploadFile(storagePathConfigs.tipProfile, profileImage);
      updated.profileImage = url;
    }
    if (thumbnails.length) {
      const urls = await Promise.all(
        thumbnails.map(async (file) => {
          const result = await uploadFile(storagePathConfigs.tipImages, file.file);
          return result;
        }),
      );
      updated.thumbnails = urls;
    }
    if (title) {
      updated.title = title;
    }
    if (contents) {
      updated.contents = contents;
    }
    if (keyword) {
      updated.keyword = keyword;
    }

    const db = getFirestore();
    const docId = getYYMMDDHHMMSS();
    await setDoc(doc(db, 'Tip', docId), updated);
    return docId;
  } catch (err) {
    return alert('잠시 후 시도해주세요');
  }
};

export default createTip;
