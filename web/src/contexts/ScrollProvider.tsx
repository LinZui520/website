import { createContext, useContext, useRef, ReactNode, useEffect } from 'react';
import useScroll from '../hooks/useScroll';
import { useLocation } from 'react-router-dom';

interface ScrollContextType {
  scrollTo: (position: number) => void;
  scrollToNoAnimation: (position: number) => void;
  refresh: () => void;
}

const ScrollContext = createContext<ScrollContextType | null>(null);

export const useScrollContext = () => {
  const context = useContext(ScrollContext);
  if (context === null) {
    throw new Error('useScrollContext must be used within a ScrollProvider');
  }
  return context;
};

const ScrollProvider = ({ children }: { children: ReactNode }) => {
  const container = useRef(document.documentElement);
  const { scrollTo, scrollToNoAnimation, Scrollbar, refresh } = useScroll(
    container,
    (x: number) => 1 - Math.pow(1 - x, 3),
    300
  );

  const { pathname } = useLocation();
  useEffect(() => {
    scrollToNoAnimation(0);
  }, [pathname, scrollToNoAnimation]);

  return (
    <ScrollContext.Provider value={{ scrollTo, scrollToNoAnimation, refresh }}>
      {children}
      <Scrollbar />
    </ScrollContext.Provider>
  );
};

export default ScrollProvider;
