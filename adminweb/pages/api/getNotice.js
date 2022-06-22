import admin from 'firebase-admin';

import initAdmin from 'utils/common/initAdmin';
import client from 'utils/common/initAlgolia';

initAdmin();

export default async (req, res) => {
  try {
    const token = req.headers['x-access-token'];

    const { uid } = await admin.auth().verifyIdToken(token);
    if (!uid) {
      return res.status(403).send({
        success: false,
        message: 'invalid token',
      });
    }

    const { offset = 0, limitNumber = 8 } = req.query;
    if (!uid) {
      return res.status(400).json({
        success: false,
        message: 'no uid',
      });
    }

    const index = client.initIndex('notice');
    const so = { length: limitNumber, offset: Number(offset) };

    const { hits } = await index.search('', so);

    return res.status(200).json({
      success: true,
      data: hits,
      message: 'successfully get notices',
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
