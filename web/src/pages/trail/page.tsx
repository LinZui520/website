import { useOutletContext, useNavigate } from 'react-router-dom';
import ChinaMap from '../../components/trail/ChinaMap';
import { OutletContext } from './type';

const Page = () => {
  const { geoData, photos } = useOutletContext<OutletContext>();
  const navigate = useNavigate();

  return (
    <div className={'h-auto min-h-screen w-full p-8 flex justify-center items-center'}>
      {geoData &&
        <ChinaMap
          className={'w-5xl h-8xl flex justify-center items-center'}
          geoData={geoData}
          onClickProvince={(provinceName) => navigate(`/trail/${provinceName}`)}
          photos={photos}
        />
      }
    </div>
  );
};

export default Page;
