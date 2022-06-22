/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable operator-linebreak */
import admin from 'firebase-admin';

import client from 'utils/common/initAlgolia';
import initAdmin from 'utils/common/initAdmin';

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

    const { companyId, keyword = null } = req.query;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: 'no company uid',
      });
    }

    const index = client.initIndex('manager');

    const { hits } = await index.search(keyword || '', { filters: `company:${companyId}` });

    return res.status(200).json({
      success: true,
      data: hits,
      message: 'successfully get managers',
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
