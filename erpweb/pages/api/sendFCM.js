import admin from 'firebase-admin';

import initAdmin from 'utils/common/initAdmin';

initAdmin();

export default async (req, res) => {
  try {
    const fcm = req.body;
    if (!fcm) {
      return res.status(400).json({
        success: false,
        message: 'no fcm',
      });
    }

    const title = '관리사 배정 완료';
    const body = '관리사가 배정되었습니다. 앱을 열어 확인해보세요.';

    const message = {
      notification: {
        title,
        body,
      },
      token: fcm,
    };

    await admin.messaging().send(message);

    return res.status(200).json({
      success: true,
      message: 'successfully send fcm',
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
