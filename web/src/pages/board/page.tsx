import { useRef } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { OutletContext } from './type';
import Footer from '../../components/Footer';

const Page = () => {
  const { boards } = useOutletContext<OutletContext>();
  const containerRef = useRef<HTMLElement | null>(null);

  useGSAP(() => {
    gsap.from('#board-title', { opacity: 0, y: 50, duration: 1, delay: 0 });
    gsap.from('#board-subtitle', { opacity: 0, y: 30, duration: 1, delay: 0.4 });
    gsap.from('.board-card', { opacity: 0, y: 30, duration: 1, delay: 0.8 });
  }, { scope: containerRef });

  return (
    <>
      <main className="w-screen bg-mint-50 dark:bg-mint-950 flex flex-col items-center pt-16 pb-16" ref={containerRef}>
        <div className="min-h-[calc(100vh-16rem)] flex flex-col items-center w-full max-w-7xl px-6 md:px-8">

          {/* Hero Section */}
          <div className="w-full flex flex-col items-center text-center mb-16 md:mb-24">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif tracking-tight text-mint-950 dark:text-mint-50 mb-6 cursor-default" id="board-title">
              留言板
            </h1>
            <div className="text-xl md:text-2xl text-mint-500 font-light tracking-wide cursor-default group" id="board-subtitle">
              留下你的想法，与他人交流
              <div
                className={'w-full h-px origin-right group-hover:origin-left transition-transform scale-x-0 group-hover:scale-x-100 duration-500 bg-mint-950 dark:bg-mint-50'}
              />
            </div>
          </div>

          {/* Bento Box Grid */}
          <div className="board-card w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[200px]">
            {boards?.map((board, index) => {
              // 平衡随机性和铺满效果的12列循环
              const layouts = [
                'col-span-2 row-span-2',
                'col-span-1 row-span-1',
                'col-span-1 row-span-1',
                'col-span-2 row-span-1',
                'col-span-2 row-span-1',
                'col-span-1 row-span-1',
                'col-span-1 row-span-1',
                'col-span-1 row-span-1',
                'col-span-1 row-span-1'
              ];

              const layout = layouts[index % layouts.length];
              // 统一的mint主题配色
              const style = { bg: 'bg-mint-50 dark:bg-mint-950', text: 'text-mint-950 dark:text-mint-50', border: 'border-mint-500' };
              const isLarge = layout.includes('span-2');

              return (
                <article
                  className={`group ${layout} ${style.bg} ${style.border} border-2 overflow-hidden transition-all duration-500 ease-out hover:scale-[0.98] hover:shadow-2xl hover:border-mint-500`}
                  key={board.board_id}
                  style={{
                    borderRadius: `${20 + (index % 3) * 5}px`
                  }}
                >
                  <Link
                    className="relative w-full h-full p-6 flex flex-col justify-between group-hover:bg-mint-500/5 transition-colors duration-300"
                    title={`${board.name} - ${board.description || '留言板'}`}
                    to={`/board/${board.board_id}`}
                  >
                    {/* 顶部装饰条 */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-mint-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right group-hover:origin-left" />

                    {/* 右上角图标 */}
                    <div className="absolute top-4 right-4">
                      <div className={`w-8 h-8 ${index % 2 === 0 ? 'bg-mint-500' : 'bg-mint-500/50'} rounded-lg flex items-center justify-center ${index % 2 === 0 ? 'text-mint-50' : 'text-mint-950'} text-sm group-hover:rotate-12 transition-transform duration-300`}>
                        {String.fromCharCode(65 + (index % 26))}
                      </div>
                    </div>

                    {/* 主要内容区 */}
                    <div className="flex-1 flex flex-col justify-center text-center px-2">
                      <h2
                        className={`${isLarge ? 'text-xl md:text-2xl' : 'text-base md:text-lg'} font-bold ${style.text} line-clamp-2 mb-3 group-hover:text-mint-500 transition-colors duration-300 break-words hyphens-auto`}
                        title={board.name.length > 30 ? board.name : undefined}
                      >
                        {board.name}
                      </h2>
                      <p
                        className={`${isLarge ? 'text-sm' : 'text-xs'} ${style.text} opacity-70 ${isLarge ? 'line-clamp-4' : 'line-clamp-3'} leading-relaxed break-words hyphens-auto`}
                        title={board.description && board.description.length > 100 ? board.description : undefined}
                      >
                        {board.description ?? '暂无描述'}
                      </p>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Page;
