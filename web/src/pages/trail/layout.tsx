import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ChinaGeoJSONCollection, GeoJSONCollection } from '../../components/trail/type';
import { PhotoVO } from './type';
import { listPhotos } from './api';

const TRAIL_IS_GLOBAL_KEY = 'ZHUGUI_TRAIL_IS_GLOBAL';

const Layout = () => {
  const [geoData, setGeoData] = useState<ChinaGeoJSONCollection | null>(null);
  const [globalGeoData, setGlobalGeoData] = useState<GeoJSONCollection | null>(null);
  const [photos, setPhotos] = useState<PhotoVO[]>([]);
  const [isGlobal, setIsGlobal] = useState<boolean>(() => {
    const stored = localStorage.getItem(TRAIL_IS_GLOBAL_KEY);
    return stored !== null ? stored === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem(TRAIL_IS_GLOBAL_KEY, String(isGlobal));
  }, [isGlobal]);

  useEffect(() => {
    fetch('/china.json').then(res => res.json()).then(data => setGeoData(data));
    fetch('/world-110m.geojson').then(res => res.json()).then(data => setGlobalGeoData(data));
    listPhotos<PhotoVO[]>().then(res => setPhotos(res.data.data));
  }, []);

  return (
    <>
      <Outlet context={{ geoData, globalGeoData, photos, isGlobal, setIsGlobal }} />
    </>
  );
};

export default Layout;
