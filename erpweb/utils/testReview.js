import { sign } from 'jsonwebtoken';

const testReviews = async () => {
  const companyId = '1';
  const managerId = 'veJ3CHSvN3BQ0jSz9et1';
  const userId = '3';
  const lastDatetime = new Date('2022-01-13');
  // const type = '중간';
  const type = '기말';

  const token = sign({ uid: managerId, target: 'manager', type }, process.env.JWT_KEY);

  console.log(token);
  const url = '/api/getReviews';
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

export default testReviews;
