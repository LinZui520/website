import useScroll from '../../hooks/useScroll.ts';
import { useRef } from 'react';
import useAuth from '../../hooks/useAuth.ts';

const Page = () => {

  const container = useRef(document.documentElement);
  useScroll(
    container,
    (x: number) => 1 - Math.pow(1 - x, 5),
    700
  );
  const { state } = useAuth();

  return (
    <main className="h-[300vh] bg-mint-50 dark:bg-mint-950 w-screen flex flex-col items-center">
      {Array.from(Array(22).keys()).map((_, i) => (
        <div className={'mt-12 text-mint-500'} key={i}>
          <span className={'text-lg'}>正文</span>
        </div>
      ))}
      {state.user?.email}
    </main>
  );
};

export default Page;
