import { DeviceType } from '@/types/device-type';
import { useEffect, useState } from 'react';

export const useDevice = (): DeviceType => {
  const [device, setDevice] = useState<DeviceType>(DeviceType.Desktop);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setDevice(DeviceType.Mobile);
      } else if (window.innerWidth < 1024) {
        setDevice(DeviceType.Tablet);
      } else {
        setDevice(DeviceType.Desktop);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return device;
};
