/* eslint-disable object-curly-newline */
import { getFirestore, collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import uploadFile from 'utils/uploads/upload';
import storagePath from 'configs/storagePath';
import dateFormat from 'utils/format/getYYYYMMDD';

const createManager = async (managerInfo, onSuccess, onError) => {
  try {
    if (!managerInfo) return console.error('no manager info');

    const {
      profileImage,
      name,
      dispatchableArea,
      birthDate,
      careerStartedDate,
      isCar,
      isResident,
      isCCTV,
      personality,
      specialty,
      certName,
      certHealth,
      certCrime,
      phone,
    } = managerInfo;

    const auth = getAuth();
    const user = auth.currentUser;

    const updated = {
      name,
      dispatchableArea,
      birthDate,
      careerStartedDate,
      isCar,
      isResident,
      isCCTV,
      personality,
      specialty,
      phone,
      company: user ? user.uid : null,
      totalReview: 0,
      status: '대기',
      dispatchStartDate: null, // 파견 중일때만 사용
      dispatchEndDate: null, // 파견 중일때만 사용
      averageReviewRate: null,
      specialtyItems: {
        정리정돈: 0,
        가족배려: 0,
        체형관리: 0,
        음식솜씨: 0,
        실전지식: 0,
        산모케어: 0,
        신생아케어: 0,
      },
      date: dateFormat(),
      profileImage: null,
      reservationNumber: null,
    };

    if (profileImage) {
      if (typeof profileImage === 'object') {
        const url = await uploadFile(storagePath.manager.profile, profileImage);
        updated.profileImage = url;
      }
    }
    if (certName) {
      if (typeof certName === 'object') {
        const url = await uploadFile(storagePath.manager.certName, certName);
        updated.certName = url;
      }
    }
    if (certHealth) {
      if (typeof certHealth === 'object') {
        const url = await uploadFile(storagePath.manager.certHealth, certHealth);
        updated.certHealth = url;
      }
    }
    if (certCrime) {
      if (typeof certCrime === 'object') {
        const url = await uploadFile(storagePath.manager.certCrime, certCrime);
        updated.certCrime = url;
      }
    }

    const db = getFirestore();
    const res = await addDoc(collection(db, 'Manager'), updated);
    await updateDoc(doc(db, 'Manager', res.id), { uid: res.id });

    onSuccess(res.id);
  } catch (err) {
    console.error(err);
    onError(err);
  }
};

export default createManager;
