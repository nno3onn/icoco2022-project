import { getAuth } from 'firebase/auth';
import getQuery from 'utils/format/query';

const searchManagerList = async (keyword, onSuccess) => {
  try {
    const auth = getAuth();
    const token = await auth.currentUser.getIdToken();

    const { uid } = auth.currentUser;

    const params = { companyId: uid, keyword };
    const query = getQuery(params);
    const url = `/api/getManagers?${query}`;

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    };

    const res = await fetch(url, options);
    const { data } = await res.json();
    onSuccess(data);
  } catch (err) {
    console.error(err);
  }
};

export default searchManagerList;
