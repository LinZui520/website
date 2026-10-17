import { useOutletContext } from 'react-router-dom';
import { useAnimatedNavigate, useAnimatedNavigateBack } from '../../contexts/TransitionProvider';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ChinaMap from '../../components/trail/ChinaMap';
import { OutletContext } from './type';
import WorldMap from '../../components/trail/WorldMap';
import Footer from '../../components/Footer';
import BackArrow from '../../components/BackArrow';
import FadeInText from '../../components/FadeInText';

const Page = () => {
  const { geoData, globalGeoData, photos, isGlobal, setIsGlobal } = useOutletContext<OutletContext>();
  const navigate = useAnimatedNavigate();
  const navigateBack = useAnimatedNavigateBack();
  const containerRef = useRef<HTMLElement | null>(null);

  useGSAP(() => {
    gsap.from('#trail-map', { opacity: 0, scale: 0.9, duration: 1, delay: 0.8 });
  }, { scope: containerRef });

  return (
    <>
      <main className="w-screen h-[calc(100vh-4rem)] md:h-[calc(100vh-8rem)] pt-16 bg-mint-50 dark:bg-mint-950 flex flex-col items-center overflow-hidden" ref={containerRef}>
        <div className="flex flex-col items-center w-full h-full max-w-7xl px-6 md:px-8 gap-6 md:gap-10">

          {/* Hero Section */}
          <div className="w-full flex flex-col items-center text-center shrink-0">
            <div className="text-xl md:text-2xl text-mint-500 font-light tracking-wide cursor-default group" id="trail-subtitle">
              <FadeInText text="你可以不懂摄影 但一定要记录生活" />
              <div
                className={'w-full h-px origin-right group-hover:origin-left transition-transform scale-x-0 group-hover:scale-x-100 duration-500 bg-mint-950 dark:bg-mint-50'}
              />
            </div>
          </div>

          {/* Map Section */}
          <div className="w-full flex-1 min-h-0 flex justify-center items-center" id="trail-map">
            {isGlobal ?
              globalGeoData &&
              <WorldMap
                className={'w-full max-w-5xl h-auto flex justify-center items-center'}
                geoData={globalGeoData}
                onClickCountry={(countryName) => {
                  if (countryName === 'China' || countryName === 'Taiwan') {
                    navigate(() => setIsGlobal(false));
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

          {/* Back to World Map */}
          {!isGlobal && (
            <BackArrow
              onClick={() => navigateBack(() => setIsGlobal(true))}
            />
          )}

        </div>
      </main>
      <Footer />
    </>
  );
};

export default Page;
