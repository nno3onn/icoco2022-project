import { sign } from 'jsonwebtoken';

const testDeleteUser = async () => {
  const uid = 'DjpCOKAkO0UIDUbatfsRWLtRemk2';

  const token = sign(uid, process.env.JWT_KEY);

  const url = '/api/deleteUser';
  const options = {
    method: 'PUT',
    headers: {
      'x-access-token': token,
    },
  };

  const res = await fetch(url, options);
  const { message } = await res.json();
};

export default testDeleteUser;
