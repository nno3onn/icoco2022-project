import { useEffect } from 'react';
import { useRouter } from 'next/router';
import pathConfigs from 'configs/path';

const EventRoot = () => {
  const router = useRouter();

  useEffect(() => {
    router.push(pathConfigs.event.default);
  }, []);

  return null;
};

export default EventRoot;
