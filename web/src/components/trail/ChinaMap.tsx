import React, { useState } from 'react';
import { ChinaGeoJSONCollection } from './type';
import { calculateBounds, convertGeoJSONToSVGPath } from './geo';
import { PhotoVO } from '../../pages/trail/type';
import { SVG_CONFIG } from './constant';

interface ChinaMapProps {
  geoData: ChinaGeoJSONCollection;
  photos: PhotoVO[];
  onClickProvince: (province: string) => void;
  className?: string;
}

const ChinaMap: React.FC<ChinaMapProps> = ({ geoData, photos, onClickProvince, className }) => {
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);

  const bounds = calculateBounds(geoData.features);
  const photosByProvince = new Map<string, number>();
  photos.forEach((p) => {
    photosByProvince.set(p.location, (photosByProvince.get(p.location) ?? 0) + 1);
  });
  const visitedCount = geoData.features.filter((f) => photosByProvince.has(f.properties.name)).length;
  const totalPhotos = photos.length;

  const getFill = (province: string) => {
    if (hoveredProvince === province) return 'var(--map-hovered)';
    if (photosByProvince.has(province)) return 'var(--map-visited)';
    return 'var(--map-unvisited)';
  };

  return (
    <div className={className}>
      <div className="relative w-full">

        {/* Info panel */}
        <div className="absolute top-0 left-0 z-10 pointer-events-none border-b border-mint-950 dark:border-mint-50 pb-1 min-w-24">
          <div className="font-mono text-sm tracking-wide text-mint-950 dark:text-mint-50">
            {hoveredProvince ?? `${visitedCount} 个省份`}
          </div>
          <div className="font-mono text-xs text-mint-500">
            {hoveredProvince
              ? `${photosByProvince.get(hoveredProvince) ?? 0} 张照片`
              : `共 ${totalPhotos} 张`}
          </div>
        </div>

        <svg className="w-full block" style={{ aspectRatio: '8/5' }} viewBox="0 0 800 500">
          <rect className="fill-mint-50 dark:fill-mint-950" height="500" width="800" />

          {geoData.features.map((feature, index) => {
            const name = feature.properties.name;
            const path = convertGeoJSONToSVGPath(feature.geometry.coordinates, bounds, SVG_CONFIG);
            if (!path) return null;
            return (
              <path
                className="transition-colors duration-200 cursor-pointer"
                d={path}
                fill={getFill(name)}
                key={feature.properties.id || `province-${index}`}
                onClick={() => onClickProvince(name)}
                onMouseEnter={() => setHoveredProvince(name)}
                onMouseLeave={() => setHoveredProvince(null)}
                strokeWidth={hoveredProvince === name ? 1.5 : 0.8}
                style={{ stroke: 'var(--map-stroke)' }}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default ChinaMap;
