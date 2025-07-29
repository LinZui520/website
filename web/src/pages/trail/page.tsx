import { useOutletContext, useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ChinaMap from '../../components/trail/ChinaMap';
import { OutletContext } from './type';
import WorldMap from '../../components/trail/WorldMap';
import Footer from '../../components/Footer';

const Page = () => {
  const { geoData, globalGeoData, photos, isGlobal, setIsGlobal } = useOutletContext<OutletContext>();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLElement | null>(null);

  useGSAP(() => {
    gsap.from('#trail-title', { opacity: 0, y: 50, duration: 1, delay: 0 });
    gsap.from('#trail-subtitle', { opacity: 0, y: 30, duration: 1, delay: 0.4 });
    gsap.from('#trail-map', { opacity: 0, scale: 0.9, duration: 1, delay: 0.8 });
  }, { scope: containerRef });

  return (
    <>
      <main className="w-screen min-h-[calc(100vh-4rem)] bg-mint-50 dark:bg-mint-950 flex flex-col items-center pt-16 pb-16" ref={containerRef}>
        <div className="flex flex-col items-center justify-around w-full min-h-[calc(100vh-12rem)] max-w-7xl px-6 md:px-8">

          {/* Hero Section */}
          <div className="w-full flex flex-col items-center text-center mb-16 md:mb-24">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif tracking-tight text-mint-950 dark:text-mint-50 mb-6 cursor-default" id="trail-title">
              足迹
            </h1>
            <div className="text-xl md:text-2xl text-mint-500 font-light tracking-wide cursor-default group" id="trail-subtitle">
              记录每一次远行
              <div
                className={'w-full h-px origin-right group-hover:origin-left transition-transform scale-x-0 group-hover:scale-x-100 duration-500 bg-mint-950 dark:bg-mint-50'}
              />
            </div>
          </div>

          {/* Map Section */}
          <div className="w-full flex justify-center items-center" id="trail-map">
            {isGlobal ?
              globalGeoData &&
              <WorldMap
                className={'w-full max-w-5xl h-auto flex justify-center items-center'}
                geoData={globalGeoData}
                onClickCountry={(countryName) => {
                  if (countryName === 'China' || countryName === 'Taiwan') {
                    setIsGlobal(false);
                    return;
                  }
                  navigate(`/trail/${countryName}`);
                }}
                photos={photos}
              /> :
              geoData &&
              <ChinaMap
                className={'w-full max-w-5xl h-auto flex justify-center items-center'}
                geoData={geoData}
                onClickProvince={(provinceName) => navigate(`/trail/${provinceName}`)}
                photos={photos}
              />
            }
          </div>

          {/* Toggle Button */}
          <div className="fixed right-12 top-32 z-10 h-16 w-16 flex items-center justify-center">
            <span
              className={`bg-mint-50 dark:bg-mint-950 text-5xl cursor-pointer select-none`}
              onClick={() => setIsGlobal((value) => !value)}
              title={isGlobal ? '切换到中国地图' : '切换到世界地图'}
            >
              {isGlobal ? 'C' : 'W'}
            </span>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
};

export default Page;
