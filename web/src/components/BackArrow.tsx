import { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAnimatedNavigateBack } from '../contexts/TransitionProvider';
import { random } from '../utils/animation';

type Props = {
  onClick?: () => void;
  className?: string;
};

const BackArrow = ({ onClick, className }: Props) => {
  const navigateBack = useAnimatedNavigateBack();
  const svgRef = useRef<SVGSVGElement>(null);
  const idleTimeline = useRef<GSAPTimeline | undefined>(undefined);
  const idleResume = useRef<GSAPTween | undefined>(undefined);
  const isHovered = useRef(false);

  useGSAP(() => {
    const paths = svgRef.current!.querySelectorAll<SVGPathElement>('path');
    // M 28 16 L 7.5 16
    const line = paths[0];
    // M 16 8 L 8 16 L 16 24（折线，miter join 无缝隙）
    const vArms = paths[1];
    const lineLen = line.getTotalLength() + 2;
    // 两臂总长 + buffer
    const vLen = vArms.getTotalLength() + 2;
    // 单臂长度（含 buffer）
    const armLen = vLen / 2;

    gsap.set(line, { strokeDasharray: lineLen, strokeDashoffset: 0 });
    vArms.setAttribute('stroke-dasharray', `${vLen} 99999`);
    vArms.setAttribute('stroke-dashoffset', '0');

    const vProxy = { δ: 0 };
    const syncVArms = () => {
      const d = vProxy.δ;
      vArms.setAttribute('stroke-dasharray', `${Math.max(0, vLen - 2 * d)} 99999`);
      vArms.setAttribute('stroke-dashoffset', String(-d));
    };

    idleTimeline.current = gsap.timeline({
      paused: true,
      onComplete: () => {
        idleResume.current = gsap.delayedCall(random(), () => idleTimeline.current?.restart());
      },
      onReverseComplete: () => {
        // 倒播回原始状态后，若仍在 hover 则触发放大
        if (isHovered.current) {
          gsap.to(svgRef.current, {
            scale: 1.2, transformOrigin: 'center center',
            duration: 0.25, ease: 'power2.out', overwrite: true
          });
        }
      }
    })
      // 消除：V 臂两端同时向交汇点收缩，横线稍后消失
      .to(vProxy, { δ: armLen, duration: 0.4, ease: 'power2.in', onUpdate: syncVArms }, 0)
      .to(line, { strokeDashoffset: lineLen, duration: 0.25, ease: 'power2.in' }, 0.3)
      // 重绘：横线先出现，横线绘制完成后 V 臂再从交汇点向两端同时展开
      .to(line, { strokeDashoffset: 0, duration: 0.3, ease: 'power2.out' }, 0.65)
      .to(vProxy, { δ: 0, duration: 0.45, ease: 'power2.out', onUpdate: syncVArms }, 0.95);

    idleResume.current = gsap.delayedCall(random(), () => idleTimeline.current?.play());
  }, { scope: svgRef });

  useEffect(() => () => { idleResume.current?.kill(); }, []);

  const handleMouseEnter = () => {
    isHovered.current = true;
    idleResume.current?.kill();

    const tl = idleTimeline.current;
    if (tl && !tl.paused() && tl.time() > 0) {
      // 动画播放中：倒播回初始状态，onReverseComplete 里再放大
      tl.reverse();
    } else {
      // 动画已暂停/未开始：直接进入 hover 放大
      tl?.seek(0).pause();
      gsap.to(svgRef.current, {
        scale: 1.2, transformOrigin: 'center center',
        duration: 0.25, ease: 'power2.out', overwrite: true
      });
    }
  };

  const handleMouseLeave = () => {
    isHovered.current = false;
    gsap.to(svgRef.current, {
      scale: 1, transformOrigin: 'center center',
      duration: 0.4, ease: 'back.out(2)', overwrite: true
    });
    idleTimeline.current?.seek(0).pause();
    idleResume.current = gsap.delayedCall(random(), () => idleTimeline.current?.play());
  };

  const handleClick = () => {
    idleResume.current?.kill();
    idleTimeline.current?.pause();
    if (onClick) onClick();
    else navigateBack();
  };

  return (
    <svg
      className={className ?? 'fixed left-12 bottom-8 h-16 w-16 fill-none stroke-3 stroke-mint-950 dark:stroke-mint-50 cursor-pointer'}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={svgRef}
      viewBox="0 0 32 32"
    >
      <path d="M 28 16 L 7.5 16" />
      <path d="M 16 8 L 8 16 L 16 24" />
    </svg>
  );
};

export default BackArrow;
