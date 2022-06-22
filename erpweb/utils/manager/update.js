import { getFirestore, doc, updateDoc } from 'firebase/firestore';

import storagePath from 'configs/storagePath';
import uploadFile from 'utils/uploads/upload';
import deleteFile from 'utils/uploads/delete';

const updateManager = async (managerInfo, onSuccess, onError) => {
  try {
    if (!managerInfo) return console.error('No manager info');

    const {
      managerId = null,
      beforeProfileImage = null,
      profileImage = null,
      name = null,
      dispatchableArea = null,
      birthDate = null,
      careerStartedDate = null,
      isCar = null,
      isResident = null,
      isCCTV = null,
      personality = null,
      specialty = null,
      certName = null,
      certHealth = null,
      certCrime = null,
      phone = null,
      status = null,
      dispatchStartDate = null,
      dispatchEndDate = null,
      beforeCertFiles = null,
    } = managerInfo;

    if (!managerId) {
      return console.error('no managerId');
    }

    const beforeCertName = beforeCertFiles ? beforeCertFiles[0] : null;
    const beforeCertHealth = beforeCertFiles ? beforeCertFiles[1] : null;
    const beforeCertCrime = beforeCertFiles ? beforeCertFiles[2] : null;

    const updated = {};

    if (profileImage) {
      if (typeof profileImage === 'object') {
        const url = await uploadFile(storagePath.manager.profile, profileImage);
        updated.profileImage = url;

        if (beforeProfileImage) {
          await deleteFile(beforeProfileImage);
        }
      }
    }
    if (name) {
      updated.name = name;
    }
    if (dispatchableArea) {
      updated.dispatchableArea = dispatchableArea;
    }
    if (birthDate) {
      updated.birthDate = birthDate;
    }
    if (careerStartedDate) {
      updated.careerStartedDate = careerStartedDate;
    }
    if (isCar) {
      updated.isCar = isCar;
    }
    if (isResident) {
      updated.isResident = isResident;
    }
    if (isCCTV) {
      updated.isCCTV = isCCTV;
    }
    if (personality) {
      updated.personality = personality;
    }
    if (specialty) {
      updated.specialty = specialty;
    }
    if (certName) {
      if (typeof certName === 'object') {
        const url = await uploadFile(storagePath.manager.certName, certName);
        updated.certName = url;

        if (beforeCertName) {
          await deleteFile(beforeCertName);
        }
      }
    }
    if (certHealth) {
      if (typeof certHealth === 'object') {
        const url = await uploadFile(storagePath.manager.certHealth, certHealth);
        updated.certHealth = url;

        if (beforeCertHealth) {
          await deleteFile(beforeCertHealth);
        }
      }
    }
    if (certCrime) {
      if (typeof certCrime === 'object') {
        const url = await uploadFile(storagePath.manager.certCrime, certCrime);
        updated.certCrime = url;

        if (beforeCertCrime) {
          await deleteFile(beforeCertCrime);
        }
      }
    }
    if (phone) {
      updated.phone = phone;
    }
    if (status) {
      updated.status = status;
    }
    if (dispatchStartDate) {
      updated.dispatchStartDate = status === '파견' ? dispatchStartDate : null;
    }
    if (dispatchEndDate) {
      updated.dispatchEndDate = status === '파견' ? dispatchEndDate : null;
    }

    const db = getFirestore();
    const docRef = doc(db, 'Manager', managerId);
    const updateTimestamp = await updateDoc(docRef, updated);

    onSuccess(updateTimestamp);
  } catch (err) {
    console.error(err);
    onError(err);
  }
};

export default updateManager;
