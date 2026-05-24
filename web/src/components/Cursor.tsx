import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Cursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;

    gsap.set([dot, ring], { opacity: 0 });

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let started = false;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!started) {
        started = true;
        ringX = mouseX;
        ringY = mouseY;
        gsap.set([dot, ring], { opacity: 1 });
      }
      gsap.set(dot, { x: mouseX, y: mouseY });
    };

    const tick = () => {
      ringX += (mouseX - ringX) * 0.1;
      ringY += (mouseY - ringY) * 0.1;
      gsap.set(ring, { x: ringX, y: ringY });
    };

    gsap.ticker.add(tick);
    window.addEventListener('mousemove', onMove);

    const onOver = (e: MouseEvent) => {
      const isInteractive = !!(e.target as Element)?.closest('a, button, [role="button"], [class*="cursor-pointer"]');
      gsap.to(ring, { scale: isInteractive ? 2.2 : 1, duration: 0.3, ease: 'power2.out' });
    };

    document.addEventListener('mouseover', onOver);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
    };
  }, []);

  return (
    <>
      <div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-mint-950 dark:bg-mint-50 pointer-events-none z-[200]"
        ref={dotRef}
        style={{ marginLeft: -3, marginTop: -3 }}
      />
      <div
        className="fixed top-0 left-0 w-7 h-7 rounded-full border border-mint-950 dark:border-mint-50 pointer-events-none z-[200]"
        ref={ringRef}
        style={{ marginLeft: -14, marginTop: -14 }}
      />
    </>
  );
};

export default Cursor;
