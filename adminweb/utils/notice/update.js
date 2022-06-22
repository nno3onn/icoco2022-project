import { getFirestore, doc, updateDoc } from 'firebase/firestore';

import storagePathConfigs from 'configs/storagePath';
import uploadFile from 'utils/uploads/upload';
import deleteFile from 'utils/uploads/delete';

const updateNotice = async (noticeInfo) => {
  try {
    if (!noticeInfo) return console.error('no notice info');

    const {
      id = null,
      title = null,
      subtitle = null,
      contents = null,
      beforeThumbnail = null,
      thumbnail = null,
    } = noticeInfo;

    if (!id) return console.error('no id');

    const updated = {};
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
      if (beforeThumbnail !== thumbnail) {
        updated.thumbnail = await uploadFile(storagePathConfigs.noticeThumbnail, thumbnail);
        await deleteFile(beforeThumbnail);
      }
    }

    const db = getFirestore();
    const docRef = doc(db, 'Notice', id);
    await updateDoc(docRef, updated);

    return;
  } catch (err) {
    alert('잠시 후 시도해주세요.');
  }
};

export default updateNotice;
