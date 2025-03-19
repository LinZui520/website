import { useRef } from 'react';
import useScroll from '../../hooks/useScroll.tsx';

const Test = () => {

  const container = useRef(null);

  const { Scrollbar } = useScroll(
    container,
    (x: number) => 1 - Math.pow(1 - x, 4),
    700
  );

  return (
    <div className={'h-[50vh] w-[80vw] overflow-y-scroll bg-mint-950 dark:bg-mint-50 relative'} ref={container}>
      {Array.from(Array(222).keys()).map((_, i) => (
        <div className={'mt-12 text-mint-500'} key={i}>
          <span className={'text-lg'}>正文</span>
        </div>
      ))}
      <Scrollbar />
    </div>
  );
};

export default Test;
