import { useState, useEffect } from 'react';
import { PhotoVO } from '../pages/trail/type';

const useProgressiveImageLoader = (photos: PhotoVO[]) => {
  const [loadedPictures, setLoadedPictures] = useState<PhotoVO[]>([]);

  useEffect(() => {
    if (photos.length === 0) {
      setLoadedPictures([]);
      return;
    }

    // 重置状态
    setLoadedPictures([]);

    // 为每张图片创建加载任务
    photos.forEach((photo) => {
      const img = new Image();

      const handleComplete = () => setLoadedPictures(prev => prev.some(p => p.photo_id === photo.photo_id) ? prev : [...prev, photo]);

      img.onload = handleComplete;
      img.onerror = handleComplete;

      // 开始加载图片
      img.src = photo.photo_url;
    });

    // 清理函数
    return () => {
      setLoadedPictures([]);
    };
  }, [photos]);

  return {
    loadedPictures
  };
};

export default useProgressiveImageLoader;
