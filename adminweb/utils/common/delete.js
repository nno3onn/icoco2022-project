import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import deleteFile from 'utils/uploads/delete';

const deleteItem = async ({ collectionName, docInfo }, onSuccess, onError) => {
  try {
    if (!collectionName || !docInfo) return;

    const {
      id = null,
      profileImage = null,
      thumbnails = null,
      appBanner = null,
      detailThumbnail = null,
      thumbnail = null,
    } = docInfo;

    if (!id) return;

    if (profileImage) {
      deleteFile(profileImage);
    }
    if (thumbnails) {
      thumbnails.forEach((image) => deleteFile(image));
    }
    if (thumbnail) {
      deleteFile(thumbnail);
    }
    if (appBanner) {
      deleteFile(appBanner);
    }
    if (detailThumbnail) {
      deleteFile(detailThumbnail);
    }

    const db = getFirestore();
    await deleteDoc(doc(db, collectionName, id));

    onSuccess();
  } catch (err) {
    console.error(err);
    onError(err);
  }
};
export default deleteItem;
