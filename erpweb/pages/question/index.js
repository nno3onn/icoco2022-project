import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Root = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/question/list');
  }, []);

  return null;
};

export default Root;
