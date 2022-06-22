/* eslint-disable operator-linebreak */
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import checkObjectFull from 'utils/format/checkObjectFull';

const updateCost = async (costInfo) => {
  try {
    if (!costInfo) return console.error('no cost info');

    const { uid } = getAuth().currentUser;
    if (!uid) return console.error('no uid');
    const { revenueCostInfo = null, serviceCostInfo = null, userCostInfo = null } = costInfo;

    const updated = {};
    if (revenueCostInfo) {
      updated.revenueCostInfo = revenueCostInfo;
    }
    if (serviceCostInfo) {
      updated.serviceCostInfo = serviceCostInfo;
    }
    if (userCostInfo) {
      updated.userCostInfo = userCostInfo;
    }

    if (checkObjectFull(revenueCostInfo) && checkObjectFull(userCostInfo)) {
      updated.isInfoFilled = true;
    } else {
      updated.isInfoFilled = false;
    }

    const db = getFirestore();
    const docRef = doc(db, 'Admin', 'info');
    await updateDoc(docRef, updated);

    return true;
  } catch (err) {
    console.error(err);
  }
};

export default updateCost;
