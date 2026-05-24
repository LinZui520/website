import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';
import Footer from '../../components/Footer';

gsap.registerPlugin(ScrollTrigger, SplitText);

const SCRAMBLE_POOL = '贺阳明工程师设计完美强迫优雅至上者主义自诩为患软件代码创造';

const Page = () => {
  const container = useRef<HTMLElement | null>(null);

  useGSAP(() => {
    gsap.set(container.current, { perspective: 1200 });

    // ── SplitText 字符分层入场 ─────────────────────────────
    const titleConfigs = [
      { id: '#main-title-1', from: { x: -80, opacity: 0 }, stagger: 0.035, duration: 0.6, ease: 'power3.out' },
      { id: '#main-title-2', from: { x: 80, opacity: 0 }, stagger: { each: 0.035, from: 'end' as const }, duration: 0.6, ease: 'power3.out' },
      { id: '#main-title-3', from: { rotationX: -90, opacity: 0, transformOrigin: 'bottom center' }, stagger: 0.04, duration: 0.7, ease: 'power3.out' },
      { id: '#main-title-4', from: { y: 60, opacity: 0 }, stagger: 0.04, duration: 0.8, ease: 'expo.out' },
      { id: '#main-title-5', from: { scale: 0, opacity: 0 }, stagger: { each: 0.06, from: 'center' as const }, duration: 0.6, ease: 'back.out(1.7)' },
      { id: '#main-title-6', from: { y: -50, rotation: -12, opacity: 0 }, stagger: { each: 0.05, from: 'random' as const }, duration: 0.6, ease: 'power2.out' }
    ];

    const splits = titleConfigs.map(({ id, from, stagger, duration, ease }) => {
      const split = new SplitText(id, { type: 'chars' });
      gsap.from(split.chars, {
        ...from,
        stagger,
        duration,
        ease,
        scrollTrigger: { trigger: id, start: 'top 88%', once: true }
      });
      return split;
    });

    gsap.from('#bottom-quote', {
      x: 80, skewX: -8, opacity: 0, duration: 0.9, ease: 'power2.out',
      scrollTrigger: { trigger: '#bottom-quote', start: 'top 88%', once: true }
    });

    // ── 持续动画 ──────────────────────────────────────────
    gsap.to('#main-title-5', { y: -10, duration: 2, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 2.2 });

    // ── 定时动画 ──────────────────────────────────────────

    // 强迫症患者: X轴震颤
    gsap.timeline({ repeat: -1, repeatDelay: 1.5, delay: 2.5 })
      .to('#main-title-5', {
        keyframes: [
          { x: -7, duration: 0.06 }, { x: 7, duration: 0.06 },
          { x: -5, duration: 0.06 }, { x: 5, duration: 0.06 },
          { x: -2, duration: 0.05 }, { x: 0, duration: 0.12, ease: 'power2.out' }
        ]
      });

    // 完美主义者: 旋转纠偏
    gsap.timeline({ repeat: -1, repeatDelay: 2, delay: 3 })
      .to('#main-title-4', {
        keyframes: [
          { rotation: 1.8, duration: 0.2, ease: 'power2.out' },
          { rotation: -1, duration: 0.18 }, { rotation: 0.5, duration: 0.14 },
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

    // ── 鼠标视差（3D 倾斜 + quote 飘移）─────────────────────
    const onMouseMove = (e: MouseEvent) => {
      const xR = e.clientX / window.innerWidth - 0.5;
      const yR = e.clientY / window.innerHeight - 0.5;
      gsap.to('#titles-container', { rotateX: -yR * 6, rotateY: xR * 10, duration: 1.0, ease: 'power2.out' });
      gsap.to('#bottom-quote', { x: xR * 25, y: yR * 12, duration: 1.0, ease: 'power2.out', overwrite: 'auto' });
    };
    const onMouseLeave = () => {
      gsap.to('#titles-container', { rotateX: 0, rotateY: 0, duration: 1.5, ease: 'power2.out' });
      gsap.to('#bottom-quote', { x: 0, y: 0, duration: 1.2, ease: 'power2.out', overwrite: 'auto' });
    };
    container.current?.addEventListener('mousemove', onMouseMove);
    container.current?.addEventListener('mouseleave', onMouseLeave);

    // ── Hover 字符扰动（波浪扫过 + 机械弹回）────────────────
    splits.forEach((split, idx) => {
      const el = document.querySelector(titleConfigs[idx].id);
      if (!el) return;
      let busy = false;

      el.addEventListener('mouseenter', () => {
        if (busy) return;
        busy = true;
        const chars = split.chars;
        const originals = chars.map(c => c.textContent ?? '');

        chars.forEach((char, i) => {
          const tl = gsap.timeline({ delay: i * 0.06 });

          // 压缩 + 淡出：进入扰动状态
          tl.to(char, { scaleY: 0.75, opacity: 0.35, duration: 0.08, ease: 'power2.in' }, 0);

          // 5 步随机字符，间隔可见
          for (let s = 0; s < 5; s++) {
            tl.call(() => {
              char.textContent = SCRAMBLE_POOL[Math.floor(Math.random() * SCRAMBLE_POOL.length)];
            }, [], 0.08 + s * 0.055);
          }

          // 复原原字 + 弹回
          tl.call(() => { char.textContent = originals[i]; }, [], 0.355);
          tl.to(char, { scaleY: 1, opacity: 1, duration: 0.28, ease: 'back.out(2)' }, 0.355);

          if (i === chars.length - 1) {
            tl.call(() => { busy = false; }, [], 0.635);
          }
        });
      });
    });

    return () => {
      container.current?.removeEventListener('mousemove', onMouseMove);
      container.current?.removeEventListener('mouseleave', onMouseLeave);
    };
  }, { scope: container });

  return (
    <>
      <main
        className="bg-mint-50 dark:bg-mint-950 text-mint-950 dark:text-mint-50 min-h-[calc(100vh-4rem)] w-screen flex flex-col items-center pt-32 pb-32 cursor-default"
        ref={container}
      >
        <div className="px-6 md:px-8">

          <div className="space-y-4 md:space-y-6" id="titles-container" style={{ transformStyle: 'preserve-3d' }}>
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight" id="main-title-1">我叫贺阳明</h2>
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight" id="main-title-2">美团软件工程师</h2>
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight" id="main-title-3">自诩为设计师</h2>
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight" id="main-title-4">完美主义者</h2>
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight text-mint-500" id="main-title-5">强迫症患者</h2>
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight" id="main-title-6">优雅至上</h2>
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
