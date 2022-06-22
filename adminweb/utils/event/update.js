import storagePathConfigs from 'configs/storagePath';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import deleteFile from 'utils/uploads/delete';
import uploadFile from 'utils/uploads/upload';

const updateEvent = async (eventInfo, onSuccess) => {
  try {
    if (!eventInfo) return console.error('no event info');

    const {
      id = null,
      beforeFiles = null,
      appBanner = null,
      thumbnail = null,
      detailThumbnail = null,
      webViewUrl = null,
      moveTo = null,
      isTypeEvent = null,
      author = null,
      title = null,
      contents = null,
      startDate = null,
      endDate = null,
    } = eventInfo;

    if (!id) return console.error('no id');

    const updated = {};

    if (webViewUrl) {
      updated.webViewUrl = webViewUrl;
      // TODO
      updated.dynamicUrl = '';
    }

    if (moveTo !== null) {
      updated.moveTo = moveTo;
    }

    if (isTypeEvent !== null) {
      const endDay = new Date(endDate);
      const today = new Date();

      const isIng = today < endDay;
      updated.status = isTypeEvent ? (isIng ? 'running' : 'completed') : 'announced';
    }

    if (author) {
      updated.author = author;
    }
    if (title !== null) {
      updated.title = title;
    }
    if (contents) {
      updated.contents = contents;
    }
    if (startDate !== null) {
      updated.startDate = startDate;
    }
    if (endDate !== null) {
      updated.endDate = endDate;
    }

    if (appBanner) {
      if (typeof appBanner === 'object') {
        const url = await uploadFile(storagePathConfigs.eventBanner, appBanner);
        updated.appBanner = url;
        if (beforeFiles.appBanner) await deleteFile(beforeFiles.appBanner);
      }
    }

    if (thumbnail) {
      if (typeof thumbnail === 'object') {
        const url = await uploadFile(storagePathConfigs.eventThumbnail, thumbnail);
        updated.thumbnail = url;

        if (beforeFiles.thumbnail) await deleteFile(beforeFiles.thumbnail);
      }
    }

    if (detailThumbnail) {
      if (typeof detailThumbnail === 'object') {
        const url = await uploadFile(storagePathConfigs.detailThumbnail, detailThumbnail);
        updated.detailThumbnail = url;

        if (beforeFiles.detailThumbnail) {
          await deleteFile(beforeFiles.detailThumbnail);
        }
      }
    }

    const db = getFirestore();
    const docRef = doc(db, 'Event', id);
    const updateTimestamp = await updateDoc(docRef, updated);

    onSuccess(updateTimestamp);
  } catch (err) {
    console.error(err);
  }
};

export default updateEvent;
