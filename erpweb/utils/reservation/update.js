/* eslint-disable object-curly-newline */
/* eslint-disable indent */
/* eslint-disable operator-linebreak */
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, updateDoc, getDoc, increment } from 'firebase/firestore';
import sendFCM from './fcm';
import sendMessage from './sendMessage';

const updateReservation = async (reservationInfo) => {
  try {
    if (!reservationInfo) return console.error('No info');

    const db = getFirestore();
    const {
      status = null,
      reservationNumber = null,
      userName = null,
      phone = null,
      fullRegNum = null,
      address = null,
      voucher = null,
      careType = null,
      reservationRoute = null,
      extraCost = null,
      revenueCost = null,
      userCost = null,
      isBirth = null,
      birthType = null,
      lactationType = null,
      animalType = null,
      requirement = null,
      birthExpectedDate = null,
      serviceStartDate = null,
      serviceEndDate = null,
      managersId = null,
      managersName = null,
      beforeManagersId = null,
      serviceDuration = null,
      allAdditionalFamily = null,
      useCareCenter = null,
      careCenterStartDate = null,
      careCenterEndDate = null,
      useHospital = null,
      hospitalStartDate = null,
      hospitalEndDate = null,
      completedBalanceCost = null,
      isFinishedBalance = null,
      isFinishedDeposit = null,
      openPopup = null,
      refundRequested = null,
      refundAccepted = null,
      refundCost = null,
      isFirstDispatchManager = null,
      changeManager = null,
      changeManagerList = null,
      email = null,
      userStep = null,
      notifyBalanceCost = null,
      notifyDepositCost = null,
      placeToBeServiced = null,
    } = reservationInfo;

    if (!reservationNumber) return console.error('no reservation number');

    const updated = {};

    if (status) {
      updated.status = status;

      if (status.includes('예약') && isBirth) {
        updated.status = isBirth === 'O' ? '예약출산일확정' : '예약출산일미확정';
      }

      if (status === '서비스종료') {
        managersId.forEach(async (id) => {
          const docRef = doc(db, 'Manager', id);
          await updateDoc(docRef, {
            dispatchStartDate: null,
            dispatchEndDate: null,
            reservationNumber: null,
            status: '대기',
          });
        });
      }
    }
    if (notifyDepositCost !== null) {
      updated.notifyDepositCost = notifyDepositCost;
    }
    if (notifyBalanceCost !== null) {
      updated.notifyBalanceCost = notifyBalanceCost;
    }
    if (userName) {
      updated.userName = userName;
    }
    if (phone) {
      updated.phone = phone;
    }
    if (fullRegNum) {
      updated.fullRegNum = fullRegNum;
    }
    if (userName) {
      updated.userName = userName;
    }
    if (address) {
      updated.address = address;
    }
    if (placeToBeServiced) {
      updated.placeToBeServiced = placeToBeServiced;
    }
    if (voucher) {
      updated.voucher = voucher;
    }
    if (careType) {
      updated.careType = careType;
    }
    if (revenueCost) {
      updated.revenueCost = Number(revenueCost);
    }
    if (userCost) {
      updated.userCost = Number(userCost);
    }
    if (completedBalanceCost) {
      updated.completedBalanceCost = completedBalanceCost;
    }
    if (isFinishedBalance) {
      updated.isFinishedBalance = isFinishedBalance;
    }
    if (isFinishedDeposit) {
      updated.isFinishedDeposit = isFinishedDeposit;
    }
    if (openPopup !== null) {
      updated.openPopup = openPopup;
    }
    if (birthType) {
      updated.birthType = birthType;
    }
    if (lactationType) {
      updated.lactationType = lactationType;
    }
    if (animalType) {
      updated.animalType = animalType;
    }
    if (requirement) {
      updated.requirement = requirement;
    }
    if (birthExpectedDate) {
      updated.birthExpectedDate = birthExpectedDate;
    }
    if (serviceStartDate) {
      updated.serviceStartDate = serviceStartDate;
    }
    if (serviceEndDate) {
      updated.serviceEndDate = serviceEndDate;
    }
    if (allAdditionalFamily) {
      updated.allAdditionalFamily = allAdditionalFamily;
    }
    if (useCareCenter !== null) {
      updated.useCareCenter = useCareCenter === 'O';
    }
    if (careCenterStartDate) {
      updated.careCenterStartDate = careCenterStartDate;
    }
    if (careCenterEndDate) {
      updated.careCenterEndDate = careCenterEndDate;
    }
    if (useHospital !== null) {
      updated.useHospital = useHospital === 'O';
    }
    if (hospitalStartDate) {
      updated.hospitalStartDate = hospitalStartDate;
    }
    if (hospitalEndDate) {
      updated.hospitalEndDate = hospitalEndDate;
    }
    if (managersName) {
      updated.managersName = managersName;
    }
    if (refundRequested !== null) {
      updated.refundRequested = refundRequested;
    }
    if (refundAccepted !== null) {
      updated.refundAccepted = refundAccepted;
    }
    if (revenueCost && userCost) {
      updated.totalCost = userCost + revenueCost;
    }
    if (userStep) {
      updated.userStep = userStep;
    }

    if (serviceDuration) {
      updated.serviceDuration = serviceDuration;
      let balanceCost;

      if (Number(serviceDuration.substring(0, 1) < 3)) {
        updated.depositCost = 50000;
        balanceCost = userCost - 50000;
      } else {
        updated.depositCost = 100000;
        balanceCost = userCost - 100000;
      }

      updated.balanceCost = balanceCost;

      if (completedBalanceCost < balanceCost && completedBalanceCost > 0) {
        updated.isFinishedBalance = '입금 중';
      } else if (completedBalanceCost >= balanceCost) {
        updated.isFinishedBalance = '입금완료';
      } else {
        updated.isFinishedBalance = '입금 전';
      }
    }

    if (isBirth !== null) {
      updated.isBirth = isBirth === 'O';
    }

    if (extraCost) {
      updated.extraCost = extraCost;
    }

    if (refundCost) {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      // 매출 올리기
      const auth = getAuth();
      const { uid } = auth.currentUser;
      const ref = doc(db, 'Company', uid);

      const docSnap = await getDoc(ref);
      if (!docSnap.exists()) {
        return console.error('doc does not exist');
      }

      const { staticsSales } = docSnap.data();

      staticsSales[year].totalYear += refundCost;
      staticsSales[year].totalMonthly[month - 1] += refundCost; // staticsSales 변경

      const updateCompany = { todaySales: increment(refundCost) }; // todaySales 변경
      updateCompany.staticsSales = staticsSales;

      await updateDoc(ref, updateCompany);
    }

    if (changeManager !== null) {
      updated.changeManager = changeManager;
      updated.changeManagerList = [];
    }

    if (changeManagerList && changeManagerList.length !== 0) {
      const intersaction = managersId.filter((e) => changeManagerList.includes(e));
      updated.changeManagerList = intersaction;

      if (intersaction.length === 0) {
        sendMessage({
          to: phone.replaceAll('-', ''),
          text: `(아이코코) ${userName}님께서 요청하신 관리사 변경이 완료되었습니다. 앱을 실행하여 배정된 관리사를 확인해보세요.`,
        });

        if (reservationRoute === '앱') {
          sendFCM({ email });
        }
      }
    }

    if (managersId) {
      updated.managersId = managersId;

      if (isFirstDispatchManager && managersId.length) {
        updated.userStep = 6;
        updated.isFirstDispatchManager = false;
        sendMessage({
          to: phone.replaceAll('-', ''),
          text: `(아이코코) ${userName}님께서 예약하신 예약에 관리사가 배정되었습니다. 앱을 실행하여 배정된 관리사를 확인해보세요.`,
        });

        if (reservationRoute === '앱') {
          sendFCM({ email });
        }
      }

      if (beforeManagersId) {
        const dispatched = managersId.filter((id) => beforeManagersId.includes(id) === false);
        dispatched.forEach(async (id) => {
          const docRef = doc(db, 'Manager', id);
          await updateDoc(docRef, {
            dispatchStartDate: serviceStartDate,
            dispatchEndDate: serviceEndDate,
            reservationNumber,
            status: '파견예정',
          });
        });

        const undispatched = beforeManagersId.filter((id) => managersId.includes(id) === false);
        undispatched.forEach(async (id) => {
          const docRef = doc(db, 'Manager', id);
          await updateDoc(docRef, {
            dispatchStartDate: null,
            dispatchEndDate: null,
            reservationNumber: null,
            status: '대기',
          });
        });
      }
    }

    const docRef = doc(db, 'Reservation', reservationNumber);
    await updateDoc(docRef, updated);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export default updateReservation;
