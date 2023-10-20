import { useEffect, useState } from 'preact/hooks';

export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 640);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
}
