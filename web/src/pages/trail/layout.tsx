import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ChinaGeoJSONCollection, GeoJSONCollection } from '../../components/trail/type';
import { PhotoVO } from './type';
import { listPhotos } from './api';

const Layout = () => {
  const [geoData, setGeoData] = useState<ChinaGeoJSONCollection | null>(null);
  const [globalGeoData, setGlobalGeoData] = useState<GeoJSONCollection | null>(null);
  const [photos, setPhotos] = useState<PhotoVO[]>([]);
  const [isGlobal, setIsGlobal] = useState(false);

  useEffect(() => {
    fetch('/china.json').then(res => res.json()).then(data => setGeoData(data));
    fetch('/world-110m.geojson').then(res => res.json()).then(data => setGlobalGeoData(data));
    listPhotos<PhotoVO[]>().then(res => setPhotos(res.data.data));
  }, []);

  return (
    <main className="w-screen h-auto flex flex-col justify-center items-center bg-mint-50 dark:bg-mint-950">
      <Outlet context={{ geoData, globalGeoData, photos, isGlobal, setIsGlobal }} />
    </main>
  );
};

export default Layout;
