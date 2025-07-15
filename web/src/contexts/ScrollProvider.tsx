import { createContext, useContext, useRef, ReactNode } from 'react';
import useScroll from '../hooks/useScroll';

interface ScrollContextType {
  scrollTo: (position: number) => void;
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
  const { scrollTo, Scrollbar } = useScroll(
    container,
    (x: number) => 1 - Math.pow(1 - x, 3),
    500
  );

  return (
    <ScrollContext.Provider value={{ scrollTo }}>
      {children}
      <Scrollbar />
    </ScrollContext.Provider>
  );
};

export default ScrollProvider;
