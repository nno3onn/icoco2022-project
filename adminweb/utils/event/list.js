import { getAuth } from 'firebase/auth';
import getQuery from 'utils/common/query';

const getEventList = async ({ filter, offset }) => {
  try {
    const token = await getAuth().currentUser.getIdToken();

    let f = '전체';
    if (filter === '이벤트 진행') {
      f = 'running';
    } else if (filter === '이벤트 종료') {
      f = 'completed';
    } else if (filter === '당첨자발표') {
      f = 'announced';
    }
    const params = { filter: f, offset };
    const query = getQuery(params);
    const url = `/api/getEvent?${query}`;

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

export default getEventList;
