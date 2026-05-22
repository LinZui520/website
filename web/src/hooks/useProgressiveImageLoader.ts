import { useState, useEffect } from 'react';
import { PhotoVO } from '../pages/trail/type';

const useProgressiveImageLoader = (photos: PhotoVO[]) => {
  const [loadedPictures, setLoadedPictures] = useState<PhotoVO[]>([]);

  useEffect(() => {
    if (photos.length === 0) {
      setLoadedPictures([]);
      return;
    }

    setLoadedPictures([]);

    let cancelled = false;
    const loadedIds = new Set<string>();

    photos.forEach((photo) => {
      const img = new Image();

      const handleComplete = () => {
        if (cancelled || loadedIds.has(photo.photo_id)) return;
        loadedIds.add(photo.photo_id);
        setLoadedPictures((prev) => [...prev, photo]);
      };

      img.onload = handleComplete;
      img.onerror = handleComplete;
      img.src = photo.photo_url;
    });

    // cleanup 标记取消，阻止旧批次的回调污染新批次状态
    return () => {
      cancelled = true;
    };
  }, [photos]);

  return { loadedPictures };
};

export default useProgressiveImageLoader;
