import { getAuth } from 'firebase/auth';

const createCompanyAuth = async ({ email, password }) => {
  try {
    const token = await getAuth().currentUser.getIdToken();

    const url = '/api/createCompany';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify({ email, password }),
    });
    const { data } = await response.json();

    const { uid } = data;
    return uid;
  } catch (err) {
    console.error(err);
  }
};

export default createCompanyAuth;
