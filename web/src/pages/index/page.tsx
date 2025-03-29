import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const Page = () => {
  const container = useRef<HTMLElement | null>(null);

  useGSAP(() => {
    gsap.from('#he', { y: '-100%', ease: 'back', duration: 0.5 });
    gsap.from('#yang', { x: '100%', ease: 'power2.out', delay: 0.5, duration: 0.5 });
    gsap.from('#ming', { x: '100%', ease: 'power2.out', delay: 0.7, duration: 0.5 });
  }, { scope: container });

  return (
    <main className="bg-mint-50 dark:bg-mint-950 h-screen w-screen flex flex-col items-center justify-center" ref={container}>
      <div className="flex flex-row justify-between w-1/2 min-w-lg text-mint-950 dark:text-mint-50 border border-mint-950 dark:border-mint-50 p-4">
        <div className="flex flex-col text-3xl">
          <span className="underline text-mint-500">Software Engineer</span>
          <span className="underline text-mint-500 mt-1">自诩为设计师</span>
          <span className="underline text-mint-500 mt-1">完美主义者</span>
          <span className="underline text-mint-500 mt-1">强迫症</span>
          <span className="underline text-mint-500 mt-1">优雅</span>
          <span className="text-6xl mt-16" style={{ writingMode: 'vertical-lr' }}>Less is more</span>
        </div>
        <div className="overflow-hidden flex flex-col items-end justify-between">
          <div className="text-9xl flex flex-col">
            <span id="he">贺</span>
            <span id="yang">阳</span>
            <span id="ming">明</span>
          </div>
          <div>
            <span className="text-3xl underline text-mint-500">Life&#39;s not out to get you</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
