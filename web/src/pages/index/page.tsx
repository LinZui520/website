import { Fragment, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Footer from '../../components/Footer';

const NAME = '贺阳明';
const ROLES = ['自诩为设计师', '完美主义者', '强迫症患者'];

/**
 * 版式：中轴金线。
 *
 * 字号是一条黄金阶梯，基准单位写死在 --r 上（25.888px = 16 × φ，16px 是页脚链接的字号）：
 *
 *     身份 : 名字 = 1 : 1.618
 *   25.888px : 41.887px
 *
 * 这里刻意不引用页脚字号 —— 16px 只是这条阶梯的出处，已经内联成字面量，
 * 改页脚不会再牵动首屏。--r 是唯一的源：名字、细线宽度、全部间距都从它推导。
 *
 * 细线宽度取名字宽度的 0.618 —— 三字名宽约 4.854r，故线宽 3r；
 * 名字到线 1.618r、线到身份 2.618r，两段间距本身也构成黄金比，由紧渐松。
 * 三个身份的字距 0.18em 会在每段末尾留出一格空隙，用等量负边距抵消，中轴才是真的对称。
 *
 * 分隔符在 700px 以下隐藏：三个身份排成一行需要容器 ≥ 24.812R + 2px，
 * R = 25.9px 时门槛约 693px，窄于此必然折行，而折行后分隔符会孤零零挂在行尾。
 */
const Page = () => {
  const container = useRef<HTMLElement | null>(null);

  useGSAP(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasPlayed = sessionStorage.getItem('curtain-played') !== null;

    // 幕布：首次访问滑上去，返回时直接隐藏；减弱动态效果时不做这层转场
    if (hasPlayed || reduce) {
      gsap.set('#curtain', { yPercent: -100 });
    } else {
      gsap.to('#curtain', { yPercent: -100, duration: 0.9, ease: 'expo.inOut', delay: 0.1 });
    }
    sessionStorage.setItem('curtain-played', '1');

    // 减弱动态效果：元素保持自然状态（就是终态），不播入场
    if (reduce) return;

    // 首访时等幕布升起一半再开始，否则入场被幕布挡住
    gsap.timeline({ delay: hasPlayed ? 0 : 0.5, defaults: { ease: 'expo.out' } })
      .from('.hp-char', {
        opacity: 0,
        y: 18,
        scaleY: 1.1,
        filter: 'blur(10px)',
        duration: 1.5,
        stagger: 0.09
      })
      .from('.hp-rule', { scaleX: 0, duration: 0.9 }, '-=0.85')
      .from('.hp-role', { opacity: 0, y: 8, duration: 0.8, stagger: 0.08 }, '-=0.65')
      .from('.hp-sep', { opacity: 0, duration: 0.4, stagger: 0.08 }, '-=0.6');
  }, { scope: container });

  return (
    <>
      <main
        className="relative overflow-hidden w-screen min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-8rem)] bg-mint-50 dark:bg-mint-950 text-mint-950 dark:text-mint-50 flex flex-col items-center justify-center px-6 pt-32 cursor-default [--r:25.888px]"
        ref={container}
      >
        <div
          className="absolute inset-0 bg-mint-50 dark:bg-mint-950 z-50 pointer-events-none"
          id="curtain"
        />

        <div className="w-full flex flex-col items-center text-center">
          <h1 className="whitespace-nowrap font-extralight leading-none text-[length:calc(var(--r)*1.618)]">
            {NAME.split('').map((char, index) => (
              <span className="hp-char inline-block mx-[0.08em]" key={`${char}-${index}`}>{char}</span>
            ))}
          </h1>

          <div className="hp-rule h-px w-[calc(var(--r)*3)] bg-mint-950/15 dark:bg-mint-50/20 mt-[calc(var(--r)*1.618)]" />

          <div className="hp-roles w-full flex flex-col min-[701px]:flex-row min-[701px]:flex-wrap items-center justify-center gap-x-[calc(var(--r)*1.618)] gap-y-[calc(var(--r)*0.8)] mt-[calc(var(--r)*2.618)] font-mono text-[length:var(--r)] tracking-[0.18em] text-mint-500">
            {ROLES.map((role, index) => (
              <Fragment key={role}>
                {index > 0 && (
                  <span
                    aria-hidden
                    className="hp-sep shrink-0 w-px h-[1.1em] bg-mint-950/15 dark:bg-mint-50/20 max-[700px]:hidden"
                  />
                )}
                <span className="hp-role whitespace-nowrap -mr-[0.18em]">{role}</span>
              </Fragment>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Page;
