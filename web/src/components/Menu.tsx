import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useLocation, Link } from 'react-router-dom';

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const container = useRef(null);
  const timeline = useRef<GSAPTimeline>(gsap.timeline({ paused: true }));

  const menu = [
    { href: '/', text: 'Home' },
    { href: '/blog', text: 'Blog' },
    { href: '/login', text: 'Login' }
  ];

  const location = useLocation();

  useEffect(() => setIsOpen(false), [location]);

  useGSAP(() => {
    timeline.current
      .to('#nav', { y: 0, duration: 0.3 }, 0)
      .to('#line1', { attr: { d: 'M 6 16 L 26 16' }, duration: 0.15 }, 0)
      .to('#line2', { attr: { d: 'M 6 16 L 26 16' }, duration: 0.15 }, 0)
      .to('#line1', { attr: { d: 'M 6 26 L 26 6' }, duration: 0.15 }, 0.15)
      .to('#line2', { attr: { d: 'M 6 6 L 26 26' }, duration: 0.15 }, 0.15);
  }, { scope: container });

  useGSAP(() => isOpen ? timeline.current.play() : timeline.current.reverse(), [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  }, [isOpen]);

  return (
    <header
      className={'bg-mint-50/0 backdrop-blur-md w-screen h-32 fixed top-0 flex flex-row items-center justify-between'}
      ref={container}
    >
      <div className={'text-mint-950 ml-12 text-3xl'}>Logo</div>
      <div className={'flex flex-row items-center justify-center mr-12'}>
        <svg
          className={'stroke-mint-950 stroke-3 z-50 h-16 w-16 cursor-pointer'}
          onClick={() => setIsOpen((val) => !val)}
          viewBox="0 0 32 32"
        >
          <path d="M 6 10 L 26 10" id="line1" strokeLinecap="round" />
          <path d="M 6 22 L 26 22" id="line2" strokeLinecap="round" />
        </svg>
      </div>
      <nav
        className={
          'bg-mint-50 h-screen w-screen fixed top-0 z-40 -translate-y-full ' +
          'flex flex-col items-center justify-center'
        }
        id="nav"
      >
        {menu.map((item, index) => (
          <Link
            className={
              'w-2/3 min-w-md h-24 text-6xl mb-6 rounded-3xl bg-mint-50 hover:bg-mint-100 text-mint-950 ' +
              'stroke-mint-500 hover:stroke-mint-950 cursor-pointer flex flex-row justify-start items-center'
            }
            key={index}
            to={item.href}
          >
            <svg className={'stroke-3 h-16 w-16 ml-12'} viewBox="0 0 32 32">
              <path d="M 6 16 L 26 16" strokeLinecap="round" />
              <path d="M 18 8 L 26 16" strokeLinecap="round" />
              <path d="M 18 24 L 26 16" strokeLinecap="round" />
            </svg>
            <span className={'ml-12'}>{item.text}</span>
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default Menu;
