import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Footer from '../../components/Footer';

gsap.registerPlugin(ScrollTrigger);

const Page = () => {
  const container = useRef<HTMLElement | null>(null);

  useGSAP(() => {
    gsap.set(container.current, { perspective: 1200 });

    // ── 入场动画（进入视野时触发）────────────────────────────
    const scrollEntry = (trigger: string, vars: gsap.TweenVars) => gsap.from(trigger, {
      ...vars,
      scrollTrigger: { trigger, start: 'top 88%', once: true }
    });

    scrollEntry('#main-title-1', { x: -120, opacity: 0, duration: 0.9, ease: 'power3.out' });
    scrollEntry('#main-title-2', { x: 120, opacity: 0, duration: 0.9, ease: 'power3.out' });
    scrollEntry('#main-title-3', { rotationX: -90, opacity: 0, duration: 0.8, ease: 'power3.out', transformOrigin: 'bottom center' });
    scrollEntry('#main-title-4', { y: 80, opacity: 0, duration: 1.0, ease: 'expo.out' });
    scrollEntry('#main-title-5', { scale: 0.6, opacity: 0, duration: 0.8, ease: 'back.out(1.7)' });
    scrollEntry('#main-title-6', { letterSpacing: '0.4em', opacity: 0, duration: 1, ease: 'power2.out' });
    scrollEntry('#bottom-quote', { x: 80, skewX: -8, opacity: 0, duration: 0.9, ease: 'power2.out' });

    // ── 持续动画 ──────────────────────────────────────────
    gsap.to('#main-title-5', {
      y: -10, duration: 2, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 2.2
    });

    // ── 定时动画 ──────────────────────────────────────────

    // 强迫症患者: X轴震颤
    gsap.timeline({ repeat: -1, repeatDelay: 1.5, delay: 2.5 })
      .to('#main-title-5', {
        keyframes: [
          { x: -7, duration: 0.06 },
          { x: 7, duration: 0.06 },
          { x: -5, duration: 0.06 },
          { x: 5, duration: 0.06 },
          { x: -2, duration: 0.05 },
          { x: 0, duration: 0.12, ease: 'power2.out' }
        ]
      });

    // 完美主义者: 旋转纠偏
    gsap.timeline({ repeat: -1, repeatDelay: 2, delay: 3 })
      .to('#main-title-4', {
        keyframes: [
          { rotation: 1.8, duration: 0.2, ease: 'power2.out' },
          { rotation: -1, duration: 0.18 },
          { rotation: 0.5, duration: 0.14 },
          { rotation: 0, duration: 0.22, ease: 'power2.inOut' }
        ]
      });

    // 自诩为设计师: scale 脉冲
    gsap.timeline({ repeat: -1, repeatDelay: 2.5, delay: 3.5 })
      .to('#main-title-3', { scale: 1.04, duration: 0.35, ease: 'power2.out' })
      .to('#main-title-3', { scale: 1, duration: 0.7, ease: 'power2.out' });

    // Less is more: 弹性强调
    gsap.timeline({ repeat: -1, repeatDelay: 3, delay: 4.5 })
      .to('#bottom-quote', { scale: 1.07, rotation: -2, duration: 0.35, ease: 'power2.out' })
      .to('#bottom-quote', { scale: 1, rotation: 0, duration: 0.7, ease: 'back.out(1.4)' });

  }, { scope: container });

  return (
    <>
      <main
        className="bg-mint-50 dark:bg-mint-950 text-mint-950 dark:text-mint-50 min-h-[calc(100vh-4rem)] w-screen flex flex-col items-center pt-32 pb-32 cursor-default"
        ref={container}
      >
        <div className="px-6 md:px-8">

          <div className="space-y-4 md:space-y-6">
            <h2
              className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight"
              id="main-title-1"
            >
              我叫贺阳明
            </h2>

            <h2
              className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight"
              id="main-title-2"
            >
              美团软件工程师
            </h2>

            <h2
              className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight"
              id="main-title-3"
            >
              自诩为设计师
            </h2>

            <h2
              className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight"
              id="main-title-4"
            >
              完美主义者
            </h2>

            <h2
              className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight text-mint-500"
              id="main-title-5"
            >
              强迫症患者
            </h2>

            <h2
              className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight"
              id="main-title-6"
            >
              优雅至上
            </h2>
          </div>

          <div className="mt-16 md:mt-24 text-right">
            <p
              className="text-4xl md:text-5xl lg:text-6xl text-mint-500 font-serif italic tracking-tight inline-block"
              id="bottom-quote"
            >
              Less is more
            </p>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
};

export default Page;
