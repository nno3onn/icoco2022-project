import { getStorage, ref, deleteObject } from 'firebase/storage';

const deleteFile = (file) => {
  try {
    if (!file) return console.error('No file');

    return new Promise((resolve) => {
      const storage = getStorage();
      const storageRef = ref(storage, file);
      deleteObject(storageRef).then((result) => {
        resolve(result);
      });
    });
  } catch (err) {
    console.error(err);
  }
};

export default deleteFile;
