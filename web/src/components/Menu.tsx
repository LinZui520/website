import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useLocation, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.ts';
import Logo from './Logo.tsx';

// type Theme = 'light' | 'dark';

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const container = useRef<HTMLElement | null>(null);
  const timeline = useRef<GSAPTimeline | undefined>(undefined);
  const auth = useAuth();

  const menu = [
    { href: '/', text: 'HOME' },
    { href: '/blog', text: 'BLOG' },
    auth.state.user ? null: { href: '/auth', text: 'LOGIN' }
  ];

  const location = useLocation();

  useEffect(() => setIsOpen(false), [location]);

  useGSAP(() => {
    timeline.current = gsap.timeline({
      onStart: () => { document.body.style.overflow = 'hidden'; },
      onReverseComplete: () => { document.body.style.overflow = 'auto'; }
    });

    timeline.current
      .to('#nav', { x: 0, duration: 0.7, ease: 'power2.out' }, 0)
      .to('#line1', { attr: { d: 'M 6 16 L 26 16' }, duration: 0.35 }, 0)
      .to('#line2', { attr: { d: 'M 6 16 L 26 16' }, duration: 0.35 }, 0)
      .to('#line1', { attr: { d: 'M 6 26 L 26 6' }, duration: 0.35 }, 0.35)
      .to('#line2', { attr: { d: 'M 6 6 L 26 26' }, duration: 0.35 }, 0.35);

    menu.filter((item) => item !== null).map((_, index) => {
      timeline.current?.from(`#nav-${index}`, { x: '150%', ease: 'power2.out', duration: 0.5 }, 0.5 + 0.1 * index);
    });

    return () => timeline.current?.kill();
  }, { scope: container });

  useGSAP(() => isOpen ? timeline.current?.play() : timeline.current?.reverse(), { scope: container, dependencies: [isOpen] });

  /**
   * const toggleTheme = (theme: Theme) => {
   *  if (theme === 'light') {
   *     document.documentElement.classList.remove('dark');
   *   } else if (theme === 'dark') {
   *     document.documentElement.classList.add('dark');
   *   }
   * };
   * useLayoutEffect(() => {
   *   const cacheTheme = localStorage.getItem('theme') as Theme | null;
   *   const isSystemThemeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
   *   toggleTheme(cacheTheme || (isSystemThemeDark ? 'dark' : 'light'));
   * }, []);
   */
  return (
    <header
      className={'w-screen h-32 z-40 fixed top-0 flex flex-row items-center justify-between font-mono'}
      ref={container}
    >
      <Logo className={'ml-12 z-40'} />
      <div className={'flex flex-row items-center justify-center mr-12 z-40 stroke-mint-950 dark:stroke-mint-50'}>
        <svg
          className={'stroke-3 h-16 w-16 cursor-pointer'}
          onClick={() => setIsOpen((val) => !val)}
          viewBox="0 0 32 32"
        >
          <path d="M 6 10 L 26 10" id="line1" />
          <path d="M 6 22 L 26 22" id="line2" />
        </svg>
      </div>
      <div
        className={
          'bg-mint-50 dark:bg-mint-950 h-screen w-screen fixed top-0 z-30 translate-x-[150%] ' +
          'flex flex-row items-center truncate'
        }
        id="nav"
      >
        <nav className={'w-2/5 h-full p-4 flex flex-col items-end justify-center gap-8'}>
          <div className={'text-base text-mint-500'}>NAVIGATION MENU</div>
          <hr className={'w-16 border-1 border-mint-500'} />
          {menu.filter((item) => item !== null).map((item, index) => (
            <Link
              className={
                'text-6xl cursor-pointer flex overflow-hidden ' +
                'select-none group text-mint-950 dark:text-mint-50'
              }
              key={index}
              tabIndex={-1}
              to={item.href}
            >
              <div className={'group-hover:opacity-50 w-full flex flex-col'} id={`nav-${index}`}>
                {item.text}
                <div className={'w-full h-1 origin-right group-hover:origin-left transition-transform scale-x-0 group-hover:scale-x-100 duration-500 bg-mint-950 dark:bg-mint-50'} />
              </div>
            </Link>
          ))}
        </nav>
        <div className={'w-2/5 h-full'} />
        <div className={'w-1/5 h-full bg-mint-100 dark:bg-mint-900 p-4 flex flex-col items-start justify-center gap-8'}>
          <div className={'text-3xl text-mint-500'}>CONTACT US</div>
          <hr className={'w-16 border-2 border-mint-500'} />
          <div className={'text-base underline text-mint-950 dark:text-mint-50'}>
            <a aria-label="gmail" href="mailto:yangminghe20@gmail.com" rel="noopener noreferrer" target="_blank">
              yangminghe20@gmail.com
            </a>
          </div>
          <div className={'text-base text-mint-950 dark:text-mint-50'}>
            <span>Copyright © </span>
            <a aria-label="github" className={'underline'} href="https://github.com/LinZui520" rel="noopener noreferrer" target="_blank">
              LinZui520
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Menu;
