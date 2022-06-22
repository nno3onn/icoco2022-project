import { config, msg } from 'solapi';
import { verify } from 'jsonwebtoken';

config.init({
  apiKey: process.env.PUPLEBOOK_API_KEY,
  apiSecret: process.env.PUPLEBOOK_SECRET_KEY,
});

export default async (req, res) => {
  try {
    const token = req.headers['x-access-token'];
    const { to, text } = verify(token, process.env.JWT_KEY);

    if (!to || !text) {
      return res.status(400).json({
        success: false,
        message: 'no to or text',
      });
    }

    await msg.send({
      messages: [
        {
          to,
          from: process.env.from_number,
          text,
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: 'successfully send message',
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
