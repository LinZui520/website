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
    // ── 幕布入场（首次访问播放，路由返回时直接隐藏）────────────
    const hasPlayed = sessionStorage.getItem('curtain-played');
    if (!hasPlayed) {
      gsap.to('#curtain', { yPercent: -100, duration: 0.9, ease: 'expo.inOut', delay: 0.1 });
      sessionStorage.setItem('curtain-played', '1');
    } else {
      gsap.set('#curtain', { yPercent: -100 });
    }

    // 每行的视差强度系数，越靠下偏移量越大，产生景深感
    const PARALLAX_FACTORS = [0.4, 0.7, 1.0, 1.4, 1.8, 2.2];

    // ── SplitText 字符分层入场 ─────────────────────────────
    const titleConfigs = [
      { id: '#main-title-1', from: { x: -80, opacity: 0 }, stagger: 0.035, duration: 0.6, ease: 'power3.out', delay: 0.2 },
      { id: '#main-title-2', from: { x: 80, opacity: 0 }, stagger: { each: 0.035, from: 'end' as const }, duration: 0.6, ease: 'power3.out', delay: 0.32 },
      { id: '#main-title-3', from: { rotationX: -90, opacity: 0, transformOrigin: 'bottom center' }, stagger: 0.04, duration: 0.7, ease: 'power3.out', delay: 0.44 },
      { id: '#main-title-4', from: { y: 60, opacity: 0 }, stagger: 0.04, duration: 0.8, ease: 'expo.out', delay: 0.56 },
      { id: '#main-title-5', from: { scale: 0, opacity: 0 }, stagger: { each: 0.06, from: 'center' as const }, duration: 0.6, ease: 'back.out(1.7)', delay: 0.68 },
      { id: '#main-title-6', from: { y: -50, rotation: -12, opacity: 0 }, stagger: { each: 0.05, from: 'random' as const }, duration: 0.6, ease: 'power2.out', delay: 0.8 }
    ];

    const splits = titleConfigs.map(({ id, from, stagger, duration, ease, delay }) => {
      const split = new SplitText(id, { type: 'chars' });
      gsap.from(split.chars, {
        ...from,
        stagger,
        duration,
        ease,
        delay,
        scrollTrigger: { trigger: id, start: 'top 88%', once: true }
      });
      return split;
    });

    gsap.from('#bottom-quote', {
      x: 80, skewX: -8, opacity: 0, duration: 0.9, ease: 'power2.out',
      delay: 0.92,
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

    // Less is more: 弹性强调 + letterSpacing 脉冲
    gsap.timeline({ repeat: -1, repeatDelay: 3, delay: 4.5 })
      .to('#bottom-quote', { scale: 1.07, rotation: -2, letterSpacing: '0.06em', duration: 0.35, ease: 'power2.out' })
      .to('#bottom-quote', { scale: 1, rotation: 0, letterSpacing: '0em', duration: 0.9, ease: 'back.out(1.4)' });

    // Less is more: 持续缓慢呼吸（letterSpacing 微展缩）
    gsap.to('#bottom-quote', {
      letterSpacing: '0.03em',
      duration: 3.5,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: 5,
      overwrite: 'auto'
    });

    // ── 鼠标视差（3D 倾斜 + quote 飘移）─────────────────────
    const onMouseMove = (e: MouseEvent) => {
      const xR = e.clientX / window.innerWidth - 0.5;
      const yR = e.clientY / window.innerHeight - 0.5;

      // 每行独立偏移，取代整体 3D 旋转
      PARALLAX_FACTORS.forEach((f, i) => {
        gsap.to(`[data-parallax="${i}"]`, { x: xR * 18 * f, y: yR * 8 * f, duration: 1.0, ease: 'power2.out', overwrite: 'auto' });
      });
      gsap.to('#bottom-quote', { x: xR * 30, y: yR * 14, duration: 1.0, ease: 'power2.out', overwrite: 'auto' });
    };
    const onMouseLeave = () => {
      PARALLAX_FACTORS.forEach((_, i) => {
        gsap.to(`[data-parallax="${i}"]`, { x: 0, y: 0, duration: 1.5, ease: 'power2.out', overwrite: 'auto' });
      });
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
      splits.forEach(s => s.revert());
      container.current?.removeEventListener('mousemove', onMouseMove);
      container.current?.removeEventListener('mouseleave', onMouseLeave);
    };
  }, { scope: container });

  return (
    <>
      <main
        className="relative overflow-hidden bg-mint-50 dark:bg-mint-950 text-mint-950 dark:text-mint-50 min-h-[calc(100vh-4rem)] w-screen flex flex-col items-center pt-32 pb-32 cursor-default"
        ref={container}
      >
        <div
          className="absolute inset-0 bg-mint-50 dark:bg-mint-950 z-50 pointer-events-none"
          id="curtain"
        />
        <div className="px-6 md:px-8">

          <div className="space-y-4 md:space-y-6" id="titles-container">
            <div data-parallax="0"><h2 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight" id="main-title-1">我叫贺阳明</h2></div>
            <div data-parallax="1"><h2 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight" id="main-title-2">美团软件工程师</h2></div>
            <div data-parallax="2"><h2 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight" id="main-title-3">自诩为设计师</h2></div>
            <div data-parallax="3"><h2 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight" id="main-title-4">完美主义者</h2></div>
            <div data-parallax="4"><h2 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight text-mint-500" id="main-title-5">强迫症患者</h2></div>
            <div data-parallax="5"><h2 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight" id="main-title-6">优雅至上</h2></div>
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
