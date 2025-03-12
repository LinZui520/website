import { useRef } from 'react';
import useScroll from '../../hooks/useScroll.ts';

const Page = () => {
  const container = useRef(null);

  useScroll(
    container,
    (x: number) => 1 - Math.pow(1 - x, 5),
    700
  );

  return (
    <main className="h-[100vh] w-screen bg-mint-50 dark:bg-mint-950 z-0 flex flex-col items-center">
      blog
      <div className="mt-80 text-6xl">得意黑</div>
      <div className={'h-[50vh] w-[80vw] overflow-y-scroll bg-amber-400 relative'} ref={container}>
        {Array.from(Array(22).keys()).map((_, i) => (
          <div className={'mt-12 text-mint-500'} key={i}>
            <span className={'text-lg'}>正文</span>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Page;
