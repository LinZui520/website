import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Footer from '../../components/Footer';

const Page = () => {
  const container = useRef<HTMLElement | null>(null);

  useGSAP(() => {
    gsap.from('#he', { y: '-150%', ease: 'back', delay: 0.5, duration: 0.5 });
    gsap.from('#yang', { x: '150%', ease: 'power2.out', delay: 1, duration: 0.5 });
    gsap.from('#ming', { x: '150%', ease: 'power2.out', delay: 1.2, duration: 0.5 });
    [1, 2, 3, 4, 5].map((i) => {
      gsap.from(`#self-${i}`, { x: '-150%', ease: 'power2.out', delay: 1.5 + i * 0.2, duration: 0.5 });
    });
    gsap.from('#life', { x: '150%', ease: 'power2.out', delay: 3, duration: 0.5 });
    gsap.from('#less', { y: '-150%', ease: 'power2.out', delay: 3.5, duration: 0.5 });
  }, { scope: container });

  return (
    <>
      <main className="bg-mint-50 dark:bg-mint-950 h-[calc(100vh-4rem)] md:h-[calc(100vh-8rem)] w-screen flex flex-col items-center justify-center overflow-hidden" ref={container}>
        <div className="flex flex-col md:flex-row justify-between w-1/2 min-w-sm text-mint-950 dark:text-mint-50 border-2 border-mint-950 dark:border-mint-50 p-4">
          <div className="flex flex-col text-2xl overflow-hidden">
            <span className="underline text-mint-500" id="self-1">Software Engineer</span>
            <span className="underline text-mint-500 mt-1" id="self-2">自诩为设计师</span>
            <span className="underline text-mint-500 mt-1" id="self-3">完美主义者</span>
            <span className="underline text-mint-500 mt-1" id="self-4">强迫症</span>
            <span className="underline text-mint-500 mt-1" id="self-5">优雅</span>
            <div className="mt-4 md:mt-16 overflow-hidden">
              <span className="text-4xl" id="less" style={{ writingMode: 'vertical-lr' }}>Less is more</span>
            </div>
          </div>
          <div className="overflow-hidden flex flex-col items-end justify-between">
            <div className="text-6xl flex flex-col">
              <span id="he">贺</span>
              <span id="yang">阳</span>
              <span id="ming">明</span>
            </div>
            <div className="mt-4 md:mt-16" id="life">
              <span className="text-2xl underline text-mint-500 text-wrap">Life&#39;s not out to get you</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Page;
