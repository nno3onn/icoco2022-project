/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
import admin from 'firebase-admin';
import { verify } from 'jsonwebtoken';

import initAdmin from 'utils/common/initAdmin';

initAdmin();

export default async (req, res) => {
  try {
    const auth = admin.auth();

    const token = req.headers['x-access-token'];
    const { uid, password } = verify(token, process.env.JWT_KEY);

    if (!uid || !password) {
      return res.status(400).json({
        success: false,
        message: 'no uid or password',
      });
    }

    const userRecord = await auth.updateUser(uid, { password });

    if (userRecord) {
      return res.status(200).json({
        success: true,
        message: 'successfully update password',
      });
    }

    return res.status(400).json({
      success: false,
      message: 'no userRecord',
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
