import { sign } from 'jsonwebtoken';

const testQuestions = async () => {
  const companyId = '1';
  const managerId = '2';
  const userId = '3';

  const token = sign({ uid: userId, searchField: 'userId' }, process.env.JWT_KEY);

  const url = '/api/getQuestions';
  const options = {
    method: 'GET',
    headers: {
      'x-access-token': token,
    },
  };

  const res = await fetch(url, options);
  const { data } = await res.json();
  console.log(data);
};

export default testQuestions;
