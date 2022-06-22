import { getAuth, signOut } from 'firebase/auth';

const accountSignOut = async () => {
  try {
    const auth = getAuth();

    await signOut(auth);
  } catch (err) {
    console.error(err);
  }
};

export default accountSignOut;
