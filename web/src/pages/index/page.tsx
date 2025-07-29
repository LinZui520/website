import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Footer from '../../components/Footer';

const Page = () => {
  const container = useRef<HTMLElement | null>(null);

  useGSAP(() => {
    gsap.from('#main-title-1', { opacity: 0, y: 50, duration: 1, delay: 0 });
    gsap.from('#main-title-2', { opacity: 0, y: 50, duration: 1, delay: 0.4 });
    gsap.from('#main-title-3', { opacity: 0, y: 50, duration: 1, delay: 0.8 });
    gsap.from('#main-title-4', { opacity: 0, y: 50, duration: 1, delay: 1.2 });
    gsap.from('#main-title-5', { opacity: 0, y: 50, duration: 1, delay: 1.6 });
    gsap.from('#main-title-6', { opacity: 0, y: 50, duration: 1, delay: 2.0 });
    gsap.from('#bottom-quote', { opacity: 0, y: 30, duration: 1, delay: 2.4 });
  }, { scope: container });

  return (
    <>
      <main className="bg-mint-50 dark:bg-mint-950 text-mint-950 dark:text-mint-50 min-h-[calc(100vh-4rem)] w-screen flex flex-col items-center pt-32 pb-32 cursor-default" ref={container}>

        {/* Main Content */}
        <div className="px-6 md:px-8">

          <div className="space-y-4 md:space-y-6">
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight" id="main-title-1">
              我叫贺阳明
            </h2>

            <h2 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight" id="main-title-2">
              美团软件工程师
            </h2>

            <h2 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight" id="main-title-3">
              自诩为设计师
            </h2>

            <h2 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight" id="main-title-4">
              完美主义者
            </h2>

            <h2 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight text-mint-500" id="main-title-5">
              强迫症患者
            </h2>

            <h2 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight" id="main-title-6">
              优雅至上
            </h2>
          </div>

          {/* Bottom Quote */}
          <div className="mt-16 md:mt-24 text-right group">
            <p className="text-4xl md:text-5xl lg:text-6xl text-mint-500 font-serif italic tracking-tight" id="bottom-quote">
              Less is more
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Page;
