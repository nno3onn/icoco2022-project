import admin from 'firebase-admin';

import initAdmin from 'utils/common/initAdmin';

initAdmin();

export default async (req, res) => {
  try {
    const token = req.headers['x-access-token'];

    const { isAdmin } = await admin.auth().verifyIdToken(token);

    if (!isAdmin) {
      return res.status(403).send({
        success: false,
        message: 'invalid token',
      });
    }
    if (req.method === 'POST') {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'no email or password',
        });
      }

      admin
        .auth()
        .createUser({ email, password })
        .then((userRecord) => {
          const { uid } = userRecord;
          admin.auth().setCustomUserClaims(uid, { isAdmin: false, isCompany: true });

          return res.status(200).json({
            success: true,
            data: { uid },
            message: 'successfully create company account',
          });
        });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
