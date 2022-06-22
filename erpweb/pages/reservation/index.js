import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Root = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/reservation/list');
  }, []);

  return null;
};

export default Root;
