import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import getFilename from 'utils/format/getFilename';

const uploadFile = (path, file) => {
  try {
    if (!path || !file) return console.error('no path or file');

    return new Promise((resolve) => {
      const filename = getFilename();
      const filepath = `${path}/${filename}.jpg`;
      const metadata = {
        contentType: 'image/jpeg',
      };

      const storage = getStorage();
      const storageRef = ref(storage, filepath);

      uploadBytes(storageRef, file, metadata).then(() => {
        const url = getDownloadURL(storageRef);
        url.then((imageUrl) => {
          resolve(imageUrl);
        });
      });
    });
  } catch (err) {
    console.error(err);
  }
};

export default uploadFile;
