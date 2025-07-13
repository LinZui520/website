import React, { useState } from 'react';
import { calculateBounds, convertGeoJSONToSVGPath } from './geo';
import { GeoJSONCollection } from './type';
import { PhotoDTO } from '../../pages/trail/type';

interface WorldMapProps {
  geoData: GeoJSONCollection;
  photos: PhotoDTO[];
  onClickCountry?: (country: string) => void;
  className?: string;
}

const WorldMap: React.FC<WorldMapProps> = ({
  geoData,
  photos,
  onClickCountry,
  className
}) => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [isChinaOrTaiwanHovered, setIsChinaOrTaiwanHovered] = useState(false);

  const getCountryFill = (country: string) => {
    if ((country === 'China' || country === 'Taiwan') && isChinaOrTaiwanHovered) {
      return '#3b82f6';
    }
    if (hoveredCountry === country) {
      return '#3b82f6';
    }
    if (photos.some(photo => photo.location === country)) {
      return '#22c55e';
    }
    if (country === 'China' || country === 'Taiwan') {
      return '#22c55e';
    }
    return '#e5e7eb';
  };

  const bounds = calculateBounds(geoData.features);

  return (
    <div className={`${className}`}>
      <svg
        className="w-full h-full mx-auto"
        style={{ aspectRatio: '8/5' }}
        viewBox="0 0 800 500"
      >
        <rect className={'fill-mint-100 dark:fill-mint-900'} height="500" width="800" />

        {geoData.features.map((feature) => {
          const countryName = feature.properties.name;
          const countryPath = convertGeoJSONToSVGPath(feature.geometry.coordinates, bounds, { padding: 30, svgWidth: 800, svgHeight: 500 });

          if (!countryPath) return null;

          return (
            <path
              className="transition-all duration-200 cursor-pointer stroke-1 hover:stroke-2 stroke-mint-50 dark:stroke-mint-950"
              d={countryPath}
              fill={getCountryFill(countryName)}
              key={feature.id}
              onClick={() => onClickCountry?.(countryName)}
              onMouseEnter={() => {
                setHoveredCountry(countryName === 'Taiwan' ? 'China' : countryName);
                setIsChinaOrTaiwanHovered(countryName === 'China' || countryName === 'Taiwan');
              }}
              onMouseLeave={() => {
                setHoveredCountry(null);
                setIsChinaOrTaiwanHovered(false);
              }}
            />
          );
        })}

        {hoveredCountry && (
          <text
            className="fill-mint-950 dark:fill-mint-50 text-base font-bold pointer-events-none"
            x="20"
            y="30"
          >
            {hoveredCountry}
          </text>
        )}
      </svg>

      {/* <div className="mt-4 text-center text-sm text-gray-600">
        <p>显示国家: {geoData.features.length} 个</p>
        <p>数据来源: https://enjalot.github.io/wwsd/data/world/world-110m.geojson</p>
      </div> */}
    </div>
  );
};

export default WorldMap;
