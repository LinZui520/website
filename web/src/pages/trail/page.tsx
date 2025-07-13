import { useOutletContext, useNavigate } from 'react-router-dom';
import ChinaMap from '../../components/trail/ChinaMap';
import { OutletContext } from './type';
import WorldMap from '../../components/trail/WorldMap';

const Page = () => {
  const { geoData, globalGeoData, photos, isGlobal, setIsGlobal } = useOutletContext<OutletContext>();
  const navigate = useNavigate();

  return (
    <div className={'h-auto min-h-screen w-full p-8 flex flex-col justify-center items-center'}>
      {isGlobal ?
        globalGeoData &&
        <WorldMap
          className={'w-5xl h-3xl flex justify-center items-center'} geoData={globalGeoData}
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
          className={'w-5xl h-8xl flex justify-center items-center'}
          geoData={geoData}
          onClickProvince={(provinceName) => navigate(`/trail/${provinceName}`)}
          photos={photos}
        />
      }

      <svg
        className={'fixed right-12 top-28 h-16 w-16 fill-none stroke-3 stroke-mint-950 dark:stroke-mint-50 cursor-pointer' + (isGlobal ? ' hidden' : '')}
        onClick={() => setIsGlobal((value) => !value)}
        viewBox="0 0 32 32"
      >
        {/* 地球外圈 */}
        <circle cx="16" cy="16" r="11" strokeWidth="2" />

        {/* 经纬线网格 */}
        <ellipse cx="16" cy="16" rx="6" ry="11" strokeWidth="1" />
        <ellipse cx="16" cy="16" rx="11" ry="4" strokeWidth="1" />
      </svg>
    </div>
  );
};

export default Page;
