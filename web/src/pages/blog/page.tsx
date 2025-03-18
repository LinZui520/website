import { useRef } from 'react';
import useScroll from '../../hooks/useScroll.tsx';
import Test from './Test.tsx';

const Page = () => {
  const container = useRef(document.documentElement);

  const { Scrollbar } = useScroll(
    container,
    (x: number) => 1 - Math.pow(1 - x, 4),
    700
  );

  return (
    <main className="h-[300vh] w-screen bg-mint-50 dark:bg-mint-950 z-0 flex flex-col items-center">
      blog
      <div className="mt-80 text-6xl">得意黑</div>
      <Test />
      <Scrollbar />
    </main>
  );
};

export default Page;
