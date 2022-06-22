/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
import admin from 'firebase-admin';
import { verify } from 'jsonwebtoken';

import initAdmin from 'utils/common/initAdmin';

initAdmin();

export default async (req, res) => {
  try {
    const token = req.headers['x-access-token'];
    const { uid } = verify(token, process.env.JWT_KEY);

    if (!uid) {
      return res.status(400).json({
        success: false,
        message: 'no uid',
      });
    }

    const auth = admin.auth();
    const { email } = await auth.getUser(uid);

    const document = admin.firestore().doc(`User/${email}`);
    await document.delete();

    auth
      .deleteUser(uid)
      .then(() =>
        res.status(300).json({
          success: true,
          message: 'successfully delete user',
        }),
      )
      .catch((err) =>
        res.status(400).json({
          success: false,
          message: err.message,
        }),
      );
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
