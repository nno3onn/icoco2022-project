import { sign } from 'jsonwebtoken';

const sendMessage = async ({ to, text }) => {
  try {
    const token = sign({ to, text }, process.env.JWT_KEY);

    const url = '/api/sendMessage';
    const options = {
      method: 'POST',
      headers: {
        'x-access-token': token,
      },
    };

    const res = await fetch(url, options);
    const { error } = await res.json();
    if (error) console.error(error);
  } catch (err) {
    console.error(err);
  }
};

export default sendMessage;
