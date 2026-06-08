import { useState, useEffect } from 'react';

export function useDevice() {
  const [device, setDevice] = useState({
    isMobile: false,
    isLowEnd: false,
  });

  useEffect(() => {
    const checkDevice = () => {
      const isMobileWidth = window.innerWidth < 768;
      const isMobileAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isMobile = isMobileWidth || isMobileAgent;
      
      const isLowEnd = (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) || false;

      setDevice({ isMobile, isLowEnd });
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return device;
}
