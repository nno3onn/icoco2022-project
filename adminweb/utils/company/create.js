/* eslint-disable no-return-assign */
import dataConfigs from 'configs/data';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import getDays from 'utils/format/getDays';

import { getMonth, getYear } from 'utils/format/getToday';
import createCompanyAuth from './auth';

const createCompany = async (companyInfo, onSuccess, onError) => {
  try {
    if (!companyInfo) return console.error('no company info');

    const {
      email = null,
      password = null,
      companyName = null,
      registerNumber = null,
      address = null,
      phone = null,
      accountHolderName = null,
      accountNumber = null,
      bankName = null,
    } = companyInfo;
    const userId = await createCompanyAuth({ email, password });

    if (!userId) return;

    const year = getYear();
    const month = getMonth();
    const days = getDays(year, month);

    const staticsReservation = {};
    staticsReservation[year] = new Array(12).fill(0);

    const staticsSales = {};
    staticsSales[year] = { totalYear: 0, totalMonthly: new Array(12).fill(0) };

    const defaultArray = new Array(5).fill(null);
    const gradesObj = {};
    dataConfigs.gradesType.forEach((e) => (gradesObj[e] = defaultArray));

    const normalGradesObj = {};
    dataConfigs.normalType.forEach((e) => (normalGradesObj[e] = defaultArray));

    const updated = {
      serviceCostInfo: { ...gradesObj, ...normalGradesObj },
      revenueCostInfo: { ...gradesObj },
      userCostInfo: { ...gradesObj },
      dispatchableArea: null,
      isFirstVisited: true,
      thumbnail: null,
      totalManager: 0,
      dispatchManager: 0,
      expectedManager: 0,
      vacationManager: 0,
      totalReservation: 0,
      todayReservation: 0,
      staticsReservation,
      thisMonthReservation: new Array(days).fill(0),
      todaySales: 0,
      staticsSales,
      totalReviewRate: 0,
      totalReview: 0,
      unReadReservation: 0,
      unReadQuestion: 0,
      isInfoFilled: false,
      preschoolerCost: 0,
      kindergartenerCost: 0,
      schoolerCost: 0,
      extraFamilyCost: 0,
    };

    if (email) {
      updated.email = email;
    }
    if (companyName) {
      updated.companyName = companyName;
    }
    if (registerNumber) {
      updated.registerNumber = registerNumber;
    }
    if (address) {
      updated.address = address;
    }
    if (userId) {
      updated.uid = userId;
    }
    if (phone) {
      const phoneFront = phone.substring(0, 3);
      const phoneCenter = phone.substring(3, 7);
      const phoneBack = phone.substring(7);
      updated.phone = `${phoneFront}-${phoneCenter}-${phoneBack}`;
    }
    if (accountHolderName) {
      updated.accountHolderName = accountHolderName;
    }
    if (accountNumber) {
      updated.accountNumber = accountNumber;
    }
    if (bankName) {
      updated.bankName = bankName;
    }

    const collectionName = 'Company';
    const db = getFirestore();
    await setDoc(doc(db, collectionName, userId), updated);
    onSuccess(userId);
  } catch (err) {
    console.error(err);
    onError(err);
  }
};

export default createCompany;
