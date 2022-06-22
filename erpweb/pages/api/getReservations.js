/* eslint-disable object-curly-newline */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable operator-linebreak */
import admin from 'firebase-admin';

import initAdmin from 'utils/common/initAdmin';
import client from 'utils/common/initAlgolia';

initAdmin();

export default async (req, res) => {
  try {
    const token = req.headers['x-access-token'];

    const { isCompany } = await admin.auth().verifyIdToken(token);
    if (!isCompany) {
      return res.status(403).send({
        success: false,
        message: 'invalid token',
      });
    }

    const { uid, filter = '전체', keyword = '', offset = 0 } = req.query;
    if (!uid) {
      return res.status(400).json({
        success: false,
        message: 'no uid',
      });
    }

    const index = client.initIndex('reservation');
    const so = {
      length: 8,
      offset: Number(offset),
    };

    so.filters =
      filter !== '전체'
        ? `status:${filter} AND chosenCompany:${uid} AND userStep >= 3`
        : `chosenCompany:${uid} AND userStep >= 3`;

    const { hits } = await index.search(keyword || '', so);

    return res.status(200).json({
      success: true,
      data: hits,
      message: 'successfully get reservations',
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
