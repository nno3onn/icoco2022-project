import { getFirestore, doc, updateDoc } from 'firebase/firestore';

import storagePathConfigs from 'configs/storagePath';
import uploadFile from 'utils/uploads/upload';
import deleteFile from 'utils/uploads/delete';

const updateTip = async (tipInfo) => {
  try {
    if (!tipInfo) return console.error('no tip info');

    const {
      title = null,
      tipId = null,
      authorId = null,
      profileImage = null,
      beforeImages = null,
      thumbnails = null,
      contents = null,
      keyword = null,
    } = tipInfo;

    if (!tipId) return console.error('no tip id');

    const updated = {};

    if (authorId) {
      updated.authorId = authorId;
    }

    if (profileImage) {
      const beforeProfileImage = beforeImages.profileImage;
      if (beforeProfileImage !== profileImage) {
        updated.profileImage = await uploadFile(storagePathConfigs.tipProfile, profileImage);
        await deleteFile(beforeProfileImage);
      }
    }

    if (thumbnails) {
      // A 차집합 삭제
      if (beforeImages) {
        const beforeThumbnails = beforeImages.thumbnails;
        beforeThumbnails.forEach(async (file) => {
          if (!thumbnails.includes(file)) {
            await deleteFile(file);
          }
        });
      }
      // B 차집합 upload
      const afterThumbnails = await Promise.all(
        thumbnails.map(async (file) => {
          if (typeof file === 'string') return file;
          if (typeof file === 'object') {
            return uploadFile(storagePathConfigs.tipImages, file.file);
          }
        }),
      );
      updated.thumbnails = afterThumbnails;
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
    const docRef = doc(db, 'Tip', tipId);
    await updateDoc(docRef, updated);
    return;
  } catch (err) {
    return alert('잠시 후 시도해주세요');
  }
};

export default updateTip;
