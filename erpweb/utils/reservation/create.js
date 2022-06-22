/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-newline */
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import getYYMMDDHHMMSS from 'utils/time/getDocId';

const createReservation = async (eventInfo, onSuccess, onError) => {
  try {
    if (!eventInfo) return console.error('No event info');

    const {
      userName = null,
      phone = null,
      fullRegNum = null,
      address = null,
      voucher = null,
      careType = null,
      extraCost = 0,
      revenueCost = 0,
      userCost = 0,
      isBirth = null,
      birthType = null,
      lactationType = null,
      animalType = null,
      requirement = null,
      birthExpectedDate = null,
      serviceStartDate = null,
      serviceEndDate = null,
      serviceDuration = null,
      allAdditionalFamily = {
        preschooler: 0,
        kindergartener: 0,
        schooler: 0,
        extraFamily: 0,
      },
      useCareCenter = null,
      careCenterStartDate = null,
      careCenterEndDate = null,
      careCenterDuration = null,
      useHospital = null,
      hospitalEndDate = null,
      placeToBeServiced = null,
    } = eventInfo;

    const auth = getAuth();
    const user = auth.currentUser;
    const reservationNumber = getYYMMDDHHMMSS();

    const updated = {
      userName,
      phone,
      fullRegNum,
      voucher,
      careType,
      birthType,
      lactationType,
      animalType,
      requirement,
      birthExpectedDate,
      serviceStartDate,
      serviceEndDate,
      allAdditionalFamily,
      email: null,
      chosenCompany: user ? user.uid : null,
      reservationNumber,
      reservationRoute: '전화',
      address,
      date: Date.now(),
      serviceDuration: null,
      totalCost: userCost + revenueCost,
      extraCost,
      revenueCost,
      userCost,
      isFinishedDeposit: '입금 전',
      isFinishedBalance: '입금 전',
      completedBalanceCost: 0,
      careCenterStartDate,
      careCenterEndDate,
      careCenterDuration,
      hospitalEndDate,
      placeToBeServiced,
      changeManager: false,
      changeManagerList: [],
      openPopup: false,
      notifyDepositCost: null,
      notifyBalanceCost: null,
      isFirstDispatchManager: true,
      managersId: [],
      managersName: [],
      userStep: 3,
    };

    if (useCareCenter !== null) {
      updated.useCareCenter = useCareCenter === 'O' && careCenterEndDate;
    }

    if (useHospital !== null) {
      updated.useHospital = useHospital === 'O' && hospitalEndDate;
    }

    if (isBirth !== null) {
      updated.isBirth = isBirth === 'O';
      updated.status = isBirth === 'O' ? '예약출산일확정' : '예약출산일미확정';
    }

    if (serviceDuration) {
      updated.serviceDuration = serviceDuration;
      if (Number(serviceDuration.substring(0, 1) < 3)) {
        updated.depositCost = 50000;
        updated.balanceCost = userCost - 50000;
      } else {
        updated.depositCost = 100000;
        updated.balanceCost = userCost - 100000;
      }
    }

    const db = getFirestore();
    await setDoc(doc(db, 'Reservation', reservationNumber), updated);

    onSuccess(reservationNumber);
  } catch (err) {
    console.error(err);
    onError(err);
  }
};

export default createReservation;
