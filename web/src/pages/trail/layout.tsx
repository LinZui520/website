import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ChinaGeoJSONCollection } from '../../components/trail/type';
import { PhotoDTO } from './type';
import { listPhotos } from './api';

const Layout = () => {
  const [geoData, setGeoData] = useState<ChinaGeoJSONCollection | null>(null);
  const [photos, setPhotos] = useState<PhotoDTO[]>([]);

  useEffect(() => {
    fetch('/china.json').then(res => res.json()).then(data => setGeoData(data));
    listPhotos<PhotoDTO[]>().then(res => setPhotos(res.data.data));
  }, []);

  return (
    <main className="w-screen h-auto flex justify-center items-center bg-mint-50 dark:bg-mint-950">
      <Outlet context={{ geoData, photos }} />
    </main>
  );
};

export default Layout;
