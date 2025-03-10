import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const container = useRef(null);
  const timeline = useRef<GSAPTimeline>(gsap.timeline({ paused: true }));

  useGSAP(() => {
    timeline.current
      .to('#line1', { attr: { d: 'M 6 16 L 26 16' }, duration: 0.2 }, 0)
      .to('#line2', { attr: { d: 'M 6 16 L 26 16' }, duration: 0.2 }, 0)
      .to('#line1', { attr: { d: 'M 6 26 L 26 6' }, duration: 0.2 }, 0.2)
      .to('#line2', { attr: { d: 'M 6 6 L 26 26' }, duration: 0.2 }, 0.2);
  }, { scope: container });

  useGSAP(() => isOpen ? timeline.current.play() : timeline.current.reverse(), [isOpen]);

  return (
    <nav
      className={'bg-mint-50/70 w-screen h-24 sticky top-0 backdrop-blur-md flex flex-row items-center justify-between'}
      ref={container}
    >
      <div className={'text-mint-800 ml-12'}>Logo</div>
      <div className={'flex flex-row items-center justify-center mr-12'}>
        <svg
          className={'stroke-mint-800 stroke-3 h-8 w-8 cursor-pointer'}
          onClick={() => setIsOpen((val) => !val)}
        >
          <path d="M 6 10 L 26 10" id="line1" strokeLinecap="round" />
          <path d="M 6 22 L 26 22" id="line2" strokeLinecap="round" />
        </svg>
      </div>
    </nav>
  );
};

export default Menu;
