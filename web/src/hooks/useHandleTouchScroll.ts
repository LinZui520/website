import {TouchEventHandler, useCallback, useEffect, useState} from "react";


const useHandleTouchScroll = () => {

  const [isScrolling, setIsScrolling] = useState(false);
  const [prevTouchY, setPrevTouchY] = useState(0);

  const handleTouch: TouchEventHandler<HTMLDivElement> = useCallback((e) => {
    if (isScrolling) return

    const windowHeight = window.innerHeight;

    const currentScroll = window.scrollY;

    const touchY = e.touches[0].clientY;

    if (prevTouchY === 0) return setPrevTouchY(touchY)

    const targetScroll = touchY < prevTouchY
      ? (Math.round(currentScroll / windowHeight) + 1) * windowHeight
      : (Math.round(currentScroll / windowHeight) - 1) * windowHeight

    setIsScrolling(true);
    setPrevTouchY(0);

    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    });

    setTimeout(() => setIsScrolling(false), 500);
  }, [isScrolling, prevTouchY])

  useEffect(() => {
    const handleTouchWithPreventDefault = (e: TouchEvent) => e.preventDefault()

    window.addEventListener('touchmove', handleTouchWithPreventDefault, { passive: false });

    return () => window.removeEventListener('touchmove', handleTouchWithPreventDefault);
  }, [handleTouch]);


  return {
    handleTouch
  };
}

export default useHandleTouchScroll;