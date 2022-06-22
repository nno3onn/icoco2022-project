/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable indent */
/* eslint-disable object-curly-newline */
import admin from 'firebase-admin';

import initAdmin from 'utils/common/initAdmin';
import client from 'utils/common/initAlgolia';

initAdmin();

export default async (req, res) => {
  try {
    const token = req.headers['x-access-token'];
    const { email } = await admin.auth().verifyIdToken(token);
    if (!email) {
      return res.status(401).send({
        success: false,
        message: 'invalid token',
      });
    }

    const {
      uid,
      target = null,
      companyId = null, // 관리사에서 받아오는 경우만 해당
      offset = 0,
      limitNumber = 4,
      type = '기말',
    } = req.query;

    if (!uid || !target) {
      return res.status(400).json({
        success: false,
        message: 'no uid or target',
      });
    }
    const index = client.initIndex('review');
    const so = {
      length: Number(limitNumber),
      offset: Number(offset),
      filters: companyId
        ? `${target}Id:${uid} AND type:${type} AND companyId:${companyId}`
        : `${target}Id:${uid} AND type:${type}`,
    };

    const { hits } = await index.search('', so);

    hits.forEach((rsv) => {
      const { userId } = rsv;
      if (userId) {
        const userDoc = admin.firestore().doc(`User/${userId}`).get();
        if (userDoc) hits.userName = userDoc.name;
      }
    });
    const reviewList = [...hits];

    // count
    const firestore = admin.firestore();

    const query = firestore
      .collection('Review')
      .where('type', '==', type)
      .where(`${target}Id`, '==', uid);
    const snap = await query.get();
    const total = snap.size || 0;

    return res.status(200).json({
      success: true,
      data: { reviewList, total },
      message: 'successfully get reviews',
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
