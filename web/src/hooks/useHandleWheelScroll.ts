import {useCallback, useEffect, useState, WheelEventHandler} from "react";

const useHandleWheelScroll = () => {

  const [isScrolling, setIsScrolling] = useState(false);

  const handleWheel: WheelEventHandler<HTMLDivElement> = useCallback((e) => {
    if (isScrolling) return;

    setIsScrolling(true);

    const windowHeight = window.innerHeight;

    const currentScroll = window.scrollY;

    const targetScroll = e.deltaY > 0
      ? (Math.round(currentScroll / windowHeight) + 1) * windowHeight
      : (Math.round(currentScroll / windowHeight) - 1) * windowHeight

    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    });

    setTimeout(() => {
      setIsScrolling(false);
    }, 500);
  }, [isScrolling]);

  const ScrollDown = () => window.scrollTo({
      top: (Math.round(window.scrollY / window.innerHeight) + 1) * window.innerHeight,
      behavior: 'smooth',
    });

  useEffect(() => {
    const handleWheelWithPreventDefault = (e: WheelEvent) => e.preventDefault()

    window.addEventListener('wheel', handleWheelWithPreventDefault, { passive: false });

    return () => window.removeEventListener('wheel', handleWheelWithPreventDefault);
  }, [handleWheel]);

  return {
    handleWheel,
    ScrollDown
  };
};

export default useHandleWheelScroll;
