import { getAuth } from 'firebase/auth';
import getQuery from 'utils/common/query';

const getTipList = async ({ filter, offset }) => {
  try {
    const token = await getAuth().currentUser.getIdToken();

    const params = { keyword: filter, offset };
    const query = getQuery(params);
    const url = `/api/getTip?${query}`;

    console.log(params);

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

export default getTipList;
