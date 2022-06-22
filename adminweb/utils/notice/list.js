import { getAuth } from 'firebase/auth';
import getQuery from 'utils/common/query';

const getNoticeList = async (offset) => {
  try {
    const token = await getAuth().currentUser.getIdToken();

    const params = { offset };
    const query = getQuery(params);
    const url = `/api/getNotice?${query}`;

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    };

    const res = await fetch(url, options);
    const { data } = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

export default getNoticeList;
