/* eslint-disable no-underscore-dangle */
/* eslint-disable object-curly-newline */
import { getAuth } from '@firebase/auth';
import miliToDate from 'utils/format/miliToDate';
import getQuery from 'utils/format/query';

const getReviews = async ({ managerId, type, offset }, onSuccess) => {
  const auth = getAuth();
  const token = await auth.currentUser.getIdToken();
  const companyId = auth.currentUser.uid;

  const params = { uid: managerId, target: 'manager', type, limitNumber: 4, offset, companyId };
  const query = getQuery(params);

  const url = `/api/getReviews?${query}`;
  const options = {
    method: 'GET',
    headers: {
      'x-access-token': token,
    },
  };

  const res = await fetch(url, options);
  const { data } = await res.json();

  const reviewList = data.reviewList.map((review) => {
    const reviewDate = review.date ? miliToDate(review.date) : null;
    const reviewSpecialty = review.specialtyItems ? review.specialtyItems.join(' | ') : null;
    return { ...review, date: reviewDate, specialtyItems: reviewSpecialty };
  });

  const result = { reviewList: [...reviewList], total: data.total };
  onSuccess(result);
};

export default getReviews;
