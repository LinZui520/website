import React, {useCallback, useEffect} from "react";
import { animateScroll as scroll } from 'react-scroll';

const useHandleWheel = () => {

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {

    const windowHeight = window.innerHeight;

    const targetScroll = e.deltaY > 0 ? (Math.round(window.scrollY / windowHeight) + 1) * windowHeight : (Math.round(window.scrollY / windowHeight) - 1) * windowHeight


    scroll.scrollTo(targetScroll, {
      duration: 500,
      smooth: 'easeInQuint',
    });

  }, []);

  useEffect(() => {
    const handleWheelWithPreventDefault = (e: WheelEvent) => {
      e.preventDefault();
      handleWheel(e as unknown as React.WheelEvent<HTMLDivElement>);
    };

    window.addEventListener('wheel', handleWheelWithPreventDefault, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheelWithPreventDefault);
    };
  }, [handleWheel]);


  return {
    handleWheel,
  };
};

export default useHandleWheel;
