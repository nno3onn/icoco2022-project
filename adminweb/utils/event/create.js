import { getFirestore, setDoc, doc } from 'firebase/firestore';

import storagePathConfigs from 'configs/storagePath';

import uploadFile from 'utils/uploads/upload';
import getYYMMDDHHMMSS from 'utils/format/getDocId';

const createEvent = async (eventInfo, onSuccess, onError) => {
  try {
    if (!eventInfo) return console.error('no event info');

    const {
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

    const updated = { date: Date.now() };

    if (appBanner) {
      updated.appBanner = appBanner;
      const url = await uploadFile(storagePathConfigs.eventBanner, appBanner);
      updated.appBanner = url;
    }

    if (thumbnail) {
      updated.thumbnail = thumbnail;
      const url = await uploadFile(storagePathConfigs.eventThumbnail, thumbnail);
      updated.thumbnail = url;
    }

    if (detailThumbnail) {
      updated.detailThumbnail = detailThumbnail;
      const url = await uploadFile(storagePathConfigs.eventDetail, detailThumbnail);
      updated.detailThumbnail = url;
    }

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
    if (title) {
      updated.title = title;
    }
    if (contents) {
      updated.contents = contents;
    }
    if (startDate) {
      updated.startDate = startDate;
    }
    if (endDate) {
      updated.endDate = endDate;
    }

    const db = getFirestore();
    const docId = getYYMMDDHHMMSS();
    await setDoc(doc(db, 'Event', docId), updated);

    onSuccess(docId);
  } catch (err) {
    console.error(err);
    onError(err);
  }
};

export default createEvent;
