/* eslint-disable object-curly-newline */
/* eslint-disable operator-linebreak */
import { getAuth } from 'firebase/auth';
import miliToDate from 'utils/format/miliToDate';
import getQuery from 'utils/format/query';
import checkDuplication from './duplicate';

const searchReservation = async ({ filter, keyword, offset }) => {
  try {
    const auth = getAuth();
    const token = await auth.currentUser.getIdToken();
    const { uid } = auth.currentUser;

    const params = { uid, filter, keyword, offset };
    const query = getQuery(params);
    const url = `/api/getReservations?${query}`;
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'x-access-token': token,
      },
    };

    const res = await fetch(url, options);
    const { data } = await res.json();

    if (data.length === 0) return [];
    const rsvList = await Promise.all(
      data.map(
        async ({
          id,
          managersId,
          managersName,
          reservationNumber,
          userName,
          phone,
          date,
          status,
          depositCost,
          serviceStartDate,
          isFinishedDeposit,
          isFinishedBalance,
          reservationRoute,
          balanceCost,
          completedBalanceCost,
          isRequestManager,
          serviceDuration,
          changeManagerList,
          notifyDepositCost,
          notifyBalanceCost,
        }) => {
          const duplication = await checkDuplication({
            phone,
            userName,
            moreThanNumber: 2,
          });

          const reservationData = {
            id,
            managersId,
            managersName: managersName ? managersName.join(', ') : null,
            reservationNumber,
            userName,
            phone,
            date: miliToDate(date),
            status,
            depositCost,
            serviceStartDate,
            isFinishedDeposit,
            isFinishedBalance,
            reservationRoute,
            balanceCost,
            completedBalanceCost,
            isRequestManager,
            serviceDuration,
            duplication,
            changeManagerList,
            notifyDepositCost,
            notifyBalanceCost,
          };
          return reservationData;
        },
      ),
    );
    return rsvList;
  } catch (err) {
    console.error(err);
  }
};

export default searchReservation;
