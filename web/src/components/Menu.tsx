import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useLocation, Link } from 'react-router-dom';

type Theme = 'light' | 'dark';

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const container = useRef<HTMLElement | null>(null);
  const timeline = useRef<GSAPTimeline | undefined>(undefined);

  const menu = [
    { href: '/', text: 'Home' },
    { href: '/blog', text: 'Blog' },
    { href: '/login', text: 'Login' }
  ];

  const location = useLocation();

  useEffect(() => setIsOpen(false), [location]);

  useGSAP(() => {
    timeline.current = gsap.timeline({
      onStart: () => { document.body.style.overflow = 'hidden'; },
      onReverseComplete: () => { document.body.style.overflow = 'auto'; }
    });

    timeline.current
      .to('#nav', { x: 0, duration: 0.3, ease: 'power1.out' }, 0)
      .to('#line1', { attr: { d: 'M 6 16 L 26 16' }, duration: 0.15 }, 0)
      .to('#line2', { attr: { d: 'M 6 16 L 26 16' }, duration: 0.15 }, 0)
      .to('#line1', { attr: { d: 'M 6 26 L 26 6' }, duration: 0.15 }, 0.15)
      .to('#line2', { attr: { d: 'M 6 6 L 26 26' }, duration: 0.15 }, 0.15);

    return () => timeline.current?.kill();
  }, { scope: container });

  useGSAP(() => isOpen ? timeline.current?.play() : timeline.current?.reverse(), [isOpen]);

  const toggleTheme = (theme: Theme) => {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  };

  useLayoutEffect(() => {
    const cacheTheme = localStorage.getItem('theme') as Theme | null;
    const isSystemThemeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    toggleTheme(cacheTheme || (!isSystemThemeDark ? 'dark' : 'light'));
  }, []);
  return (
    <header
      className={'bg-mint-50/0 dark:bg-mint-950/0 backdrop-blur-md w-screen h-32 z-50 fixed top-0 flex flex-row items-center justify-between'}
      ref={container}
    >
      <div className={'text-mint-950 dark:text-mint-50 ml-12 text-6xl z-50'}>Logo</div>
      <div className={'flex flex-row items-center justify-center mr-12 z-50 stroke-mint-950 dark:stroke-mint-50'}>
        <svg
          className={'stroke-3 h-16 w-16 cursor-pointer'}
          onClick={() => setIsOpen((val) => !val)}
          viewBox="0 0 32 32"
        >
          <path d="M 6 10 L 26 10" id="line1" />
          <path d="M 6 22 L 26 22" id="line2" />
        </svg>
      </div>
      <nav
        className={
          'bg-mint-50 dark:bg-mint-950 h-screen w-screen fixed top-0 z-40 translate-x-full ' +
          'flex flex-col items-center justify-center'
        }
        id="nav"
      >
        {menu.map((item, index) => (
          <Link
            className={
              'w-2/3 min-w-md h-24 text-6xl mb-6 rounded-3xl cursor-pointer flex flex-row justify-start items-center ' +
              'select-none group bg-mint-50 hover:bg-mint-100 dark:bg-mint-950 dark:hover:bg-mint-900 ' +
              'text-mint-950 dark:text-mint-50 stroke-mint-950 dark:stroke-mint-50'
            }
            key={index}
            to={item.href}
          >
            <svg className={'stroke-3 group-hover:w-16 w-0 ml-12 duration-700 ease-in-out'} viewBox="0 0 32 32">
              <path d="M 26 16 L 26 16" strokeLinecap="round" />
              <path d="M 6 16 L 26 16 M 18 8 L 26 16 M 18 24 L 26 16" />
            </svg>
            <span className={'ml-12'}>{item.text}</span>
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default Menu;
