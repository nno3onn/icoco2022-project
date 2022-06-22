/* eslint-disable operator-linebreak */

import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import checkObjectFull from 'utils/format/checkObjectFull';
import deleteFile from 'utils/uploads/delete';
import uploadFile from 'utils/uploads/upload';

const updateCompany = async (companyInfo) => {
  try {
    if (!companyInfo) return console.error('No company info');

    const {
      companyId = null,
      beforeThumbnail = null,
      thumbnail = null,
      isFirstVisited = null,
      companyName = null,
      phone = null,
      registerNumber = null,
      address = null,
      dispatchableArea = null,
      homepage = null,
      blog = null,
      momcafe = null,
      preschoolerCost = null,
      kindergartenerCost = null,
      schoolerCost = null,
      extraFamilyCost = null,
      serviceCostInfo = null,
      revenueCostInfo = null,
      userCostInfo = null,
    } = companyInfo;

    if (!companyId) return console.error('no company id');

    const updated = {};

    if (thumbnail) {
      if (typeof thumbnail === 'object') {
        const url = await uploadFile('company', thumbnail);
        updated.thumbnail = url;

        if (beforeThumbnail) {
          await deleteFile(beforeThumbnail);
        }
      }
    }
    if (isFirstVisited !== null) {
      updated.isFirstVisited = isFirstVisited;
    }
    if (companyName) {
      updated.companyName = companyName;
    }
    if (phone) {
      updated.phone = phone;
    }
    if (registerNumber) {
      updated.registerNumber = registerNumber;
    }
    if (address) {
      updated.address = address;
    }
    if (dispatchableArea) {
      updated.dispatchableArea = dispatchableArea;
    }
    if (homepage) {
      updated.homepage = homepage;
    }
    if (blog) {
      updated.blog = blog;
    }
    if (momcafe) {
      updated.momcafe = momcafe;
    }
    if (preschoolerCost) {
      updated.preschoolerCost = +preschoolerCost;
    }
    if (kindergartenerCost) {
      updated.kindergartenerCost = +kindergartenerCost;
    }
    if (schoolerCost) {
      updated.schoolerCost = +schoolerCost;
    }
    if (extraFamilyCost) {
      updated.extraFamilyCost = +extraFamilyCost;
    }

    if (revenueCostInfo) {
      updated.revenueCostInfo = revenueCostInfo;
    }
    if (serviceCostInfo) {
      updated.serviceCostInfo = serviceCostInfo;
    }
    if (userCostInfo) {
      updated.userCostInfo = userCostInfo;
    }

    if (
      checkObjectFull(revenueCostInfo) &&
      checkObjectFull(userCostInfo) &&
      preschoolerCost &&
      kindergartenerCost &&
      schoolerCost &&
      extraFamilyCost
    ) {
      updated.isInfoFilled = true;
    } else {
      updated.isInfoFilled = false;
    }

    const db = getFirestore();
    const docRef = doc(db, 'Company', companyId);
    await updateDoc(docRef, updated);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export default updateCompany;
