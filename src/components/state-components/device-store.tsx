'use client';
import { useDeviceStore } from '@/store/user-device';
import { OS } from '@/types/device';
import React, { useEffect } from 'react';

const getUserMobileOperatingSystem = (userAgent: string): OS => {
  if (userAgent.match(/Android/i)) {
    return 'android';
  }
  if (userAgent.match(/iPhone|iPad|iPod/i)) {
    return 'ios';
  }
  if (userAgent.match(/Windows Phone|Windows/i)) {
    return 'windows';
  }
  if (userAgent.match(/Linux/i)) {
    return 'linux';
  }
  return 'other';
};

const getUserBrowser = (userAgent: string): string => {
  if (userAgent.match(/Firefox/i)) {
    return 'Firefox';
  }
  if (userAgent.match(/Chrome/i)) {
    return 'Chrome';
  }
  if (userAgent.match(/Safari/i)) {
    return 'Safari';
  }
  if (userAgent.match(/Opera/i)) {
    return 'Opera';
  }
  if (userAgent.match(/MSIE/i) || userAgent.match(/Trident/i)) {
    return 'Internet Explorer';
  }
  return 'unknown';
};

export const DeviceStore: React.FC = () => {
  const setDevice = useDeviceStore((state) => state.setDevice);
  const setDeviceWidth = useDeviceStore((state) => state.setWidth);
  useEffect(() => {
    if (!window) return;
    const userAgent = window.navigator.userAgent;

    setDevice({
      os: getUserMobileOperatingSystem(userAgent),
      browser: getUserBrowser(userAgent),
      width: window.innerWidth,
      type: 'unknown',
    });
  }, []);

  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;

    const handleResize = () => {
      if (!window) return;

      clearTimeout(resizeTimeout);

      resizeTimeout = setTimeout(() => {
        const deviceWidth = window.innerWidth;
        setDeviceWidth(deviceWidth);
      }, 200);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);
  return null;
};
