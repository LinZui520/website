import { useState, useEffect } from 'react';
import { PhotoVO } from '../pages/trail/type';

const useProgressiveImageLoader = (photos: PhotoVO[]) => {
  const [loadedPictures, setLoadedPictures] = useState<PhotoVO[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (photos.length === 0) {
      setLoadedPictures([]);
      setIsLoading(false);
      return;
    }

    setLoadedPictures([]);
    setIsLoading(true);

    let cancelled = false;
    const loadedIds = new Set<string>();
    let completedCount = 0;

    photos.forEach((photo) => {
      const img = new Image();

      const handleComplete = () => {
        if (cancelled || loadedIds.has(photo.photo_id)) return;
        loadedIds.add(photo.photo_id);
        completedCount++;
        setLoadedPictures((prev) => [...prev, photo]);
        if (completedCount === photos.length) {
          setIsLoading(false);
        }
      };

      img.onload = handleComplete;
      img.onerror = handleComplete;
      img.src = photo.photo_url;
    });

    return () => {
      cancelled = true;
    };
  }, [photos]);

  return { loadedPictures, isLoading };
};

export default useProgressiveImageLoader;
