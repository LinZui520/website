import { createContext, useContext, useRef, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

interface TransitionContextValue {
  navigate: (to: string | (() => void)) => void;
  navigateBack: (callback?: () => void) => void;
}

const TransitionContext = createContext<TransitionContextValue>({
  navigate: () => {},
  navigateBack: () => {}
});

export const useAnimatedNavigate = () => useContext(TransitionContext).navigate;
export const useAnimatedNavigateBack = () => useContext(TransitionContext).navigateBack;

const TransitionProvider = ({ children }: { children: ReactNode }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const centerTextRef = useRef<HTMLDivElement>(null);
  const router = useNavigate();
  const isAnimating = useRef(false);

  const runTransition = (midpoint: () => void, back: boolean) => {
    if (isAnimating.current || !overlayRef.current) return;
    isAnimating.current = true;

    const enterOrigin = back ? 'bottom center' : 'top center';
    const exitOrigin = back ? 'top center' : 'bottom center';

    gsap.timeline({
      onComplete: () => { isAnimating.current = false; }
    })
      .set(overlayRef.current, { scaleY: 0, transformOrigin: enterOrigin })
      .set(centerTextRef.current, { opacity: 0 })
      .to(overlayRef.current, { scaleY: 1, duration: 0.45, ease: 'power3.inOut' })
      .call(() => { midpoint(); })
      .to(centerTextRef.current, { opacity: 1, duration: 0.15 })
      .to(centerTextRef.current, { opacity: 0, duration: 0.15 }, '+=0.2')
      .set(overlayRef.current, { transformOrigin: exitOrigin })
      .to(overlayRef.current, { scaleY: 0, duration: 0.45, ease: 'power3.inOut', delay: 0.1 });
  };

  const navigate = (to: string | (() => void)) => {
    const midpoint = typeof to === 'string' ? () => { router(to); } : to;
    runTransition(midpoint, false);
  };

  const navigateBack = (callback?: () => void) => {
    const midpoint = callback ?? (() => { router(-1); });
    runTransition(midpoint, true);
  };

  return (
    <TransitionContext.Provider value={{ navigate, navigateBack }}>
      {children}
      <div
        className="fixed inset-0 z-50 bg-mint-500 pointer-events-none"
        ref={overlayRef}
        style={{ transform: 'scaleY(0)' }}
      />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none font-mono font-light text-xl md:text-4xl lg:text-5xl tracking-[0.3em] text-mint-50 dark:text-mint-950"
        ref={centerTextRef}
        style={{ zIndex: 51, opacity: 0 }}
      >
        ZHUGUISHIHUNDAN
      </div>
    </TransitionContext.Provider>
  );
};

export default TransitionProvider;
