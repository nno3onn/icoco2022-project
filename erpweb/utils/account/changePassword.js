import {
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';

const accountChangePassword = async (passwordInfo, onSuccess, onError) => {
  try {
    if (!passwordInfo) return console.error('no password info');

    const { password, newPassword } = passwordInfo;

    const auth = getAuth();
    const user = auth.currentUser;

    const credential = EmailAuthProvider.credential(user.email, password);
    reauthenticateWithCredential(user, credential)
      .then(() => {
        updatePassword(user, newPassword).then(() => {
          onSuccess();
        });
      })
      .catch((err) => {
        console.error(err);
        onError(err);
      });
  } catch (err) {
    console.error(err);
    onError(err);
  }
};

export default accountChangePassword;
