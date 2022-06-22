import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import LoadingView from 'components/loading';
import Entrance from 'components/entrance';
import Nav from 'components/nav';

import styles from './auth.module.scss';

const AuthHoc = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authentication, setAuthentication] = useState(false);

  useEffect(() => {
    try {
      const auth = getAuth();

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const token = await user.getIdTokenResult();
          const { isAdmin } = token.claims;
          setAuthentication(isAdmin);
        }
        setLoading(false);
      });
    } catch (err) {
      setAuthentication(false);
      setLoading(false);
    }
  }, []);

  if (loading) return <LoadingView />;
  if (!authentication) return <Entrance />;

  return (
    <>
      <Nav />
      <div className={styles.page}>{children}</div>
    </>
  );
};

export default AuthHoc;
