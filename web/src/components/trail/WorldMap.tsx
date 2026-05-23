import React, { useState } from 'react';
import { calculateBounds, convertGeoJSONToSVGPath } from './geo';
import { GeoJSONCollection } from './type';
import { PhotoVO } from '../../pages/trail/type';
import { SVG_CONFIG } from './constant';

interface WorldMapProps {
  geoData: GeoJSONCollection;
  photos: PhotoVO[];
  onClickCountry?: (country: string) => void;
  className?: string;
}

const WorldMap: React.FC<WorldMapProps> = ({ geoData, photos, onClickCountry, className }) => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [isChinaOrTaiwanHovered, setIsChinaOrTaiwanHovered] = useState(false);

  const bounds = calculateBounds(geoData.features);
  const photosByCountry = new Map<string, number>();
  photos.forEach((p) => {
    photosByCountry.set(p.location, (photosByCountry.get(p.location) ?? 0) + 1);
  });

  const visitedCount = geoData.features.filter((f) => {
    if (f.properties.name === 'Taiwan') return false;
    return f.properties.name === 'China' || photosByCountry.has(f.properties.name);
  }).length;
  const totalPhotos = photos.length;

  const getFill = (country: string) => {
    if ((country === 'China' || country === 'Taiwan') && isChinaOrTaiwanHovered) return 'var(--map-hovered)';
    if (hoveredCountry === country) return 'var(--map-hovered)';
    if (photosByCountry.has(country)) return 'var(--map-visited)';
    if (country === 'China' || country === 'Taiwan') return 'var(--map-visited)';
    return 'var(--map-unvisited)';
  };

  const displayName = hoveredCountry === 'China' && isChinaOrTaiwanHovered ? 'China' : hoveredCountry;

  return (
    <div className={className}>
      <div className="relative w-full">

        {/* Info panel */}
        <div className="absolute top-0 left-0 z-10 pointer-events-none border-b border-mint-950 dark:border-mint-50 pb-1 min-w-24">
          <div className="font-mono text-sm tracking-wide text-mint-950 dark:text-mint-50">
            {displayName ?? `${visitedCount} 个国家`}
          </div>
          <div className="font-mono text-xs text-mint-500">
            {displayName
              ? (displayName === 'China'
                ? '点击展开'
                : `${photosByCountry.get(displayName) ?? 0} 张照片`)
              : `共 ${totalPhotos} 张`}
          </div>
        </div>

        <svg className="w-full block" style={{ aspectRatio: '8/5' }} viewBox="0 0 800 500">
          <rect className="fill-mint-50 dark:fill-mint-950" height="500" width="800" />

          {geoData.features.map((feature) => {
            const name = feature.properties.name;
            const path = convertGeoJSONToSVGPath(feature.geometry.coordinates, bounds, SVG_CONFIG);
            if (!path) return null;
            return (
              <path
                className="transition-colors duration-200 cursor-pointer"
                d={path}
                fill={getFill(name)}
                key={feature.id}
                onClick={() => onClickCountry?.(name)}
                onMouseEnter={() => {
                  setHoveredCountry(name === 'Taiwan' ? 'China' : name);
                  setIsChinaOrTaiwanHovered(name === 'China' || name === 'Taiwan');
                }}
                onMouseLeave={() => {
                  setHoveredCountry(null);
                  setIsChinaOrTaiwanHovered(false);
                }}
                strokeWidth={
                  (name === 'China' || name === 'Taiwan') && isChinaOrTaiwanHovered
                    ? 1.5
                    : hoveredCountry === name
                      ? 1.5
                      : 0.8
                }
                style={{ stroke: 'var(--map-stroke)' }}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default WorldMap;
