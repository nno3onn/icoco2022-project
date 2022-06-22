import { getMetadata, ref, getStorage } from 'firebase/storage';

const getFileData = async (url) => {
  try {
    if (!url) return console.error('No url');

    const storage = getStorage();
    const storageRef = ref(storage, url);
    const data = await getMetadata(storageRef);
    return data;
  } catch (err) {
    console.error(err);
  }
};
export default getFileData;
