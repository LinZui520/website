import React, { useState } from 'react';
import { ChinaGeoJSONCollection } from './type';
import { calculateBounds, convertGeoJSONToSVGPath } from './geo';
import { PhotoVO } from '../../pages/trail/type';

interface ChinaMapProps {
  geoData: ChinaGeoJSONCollection;
  photos: PhotoVO[];
  onClickProvince: (province: string) => void;
  className?: string;
}

const ChinaMap: React.FC<ChinaMapProps> = ({ geoData, photos, onClickProvince, className }) => {
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);

  const bounds = calculateBounds(geoData.features);

  const getProvinceFill = (province: string) => {
    if (hoveredProvince === province) {
      return '#3b82f6';
    }

    if (photos.some(photo => photo.location === province)) {
      return '#22c55e';
    }

    return '#e5e7eb';
  };

  return (
    <div className={`${className}`}>
      <svg
        className="w-full h-full mx-auto"
        style={{ aspectRatio: '8/5' }}
        viewBox="0 0 800 500"
      >
        <rect className={'fill-mint-100 dark:fill-mint-900'} height="500" width="800" />

        {geoData.features.map((feature, index) => {
          const provinceName = feature.properties.name;
          const provincePath = convertGeoJSONToSVGPath(feature.geometry.coordinates, bounds, { padding: 30, svgWidth: 800, svgHeight: 500 });

          if (!provincePath) return null;

          return (
            <path
              className="transition-all duration-200 cursor-pointer stroke-1 hover:stroke-2 stroke-mint-50 dark:stroke-mint-950"
              d={provincePath}
              fill={getProvinceFill(provinceName)}
              key={feature.properties.id || `province-${index}`}
              onClick={() => onClickProvince(provinceName)}
              onMouseEnter={() => setHoveredProvince(provinceName)}
              onMouseLeave={() => setHoveredProvince(null)}
            />
          );
        })}

        {hoveredProvince && (
          <text
            className="fill-mint-950 dark:fill-mint-50 text-base font-bold pointer-events-none"
            x="20"
            y="30"
          >
            {hoveredProvince}
          </text>)
        }
      </svg>
    </div>
  );
};

export default ChinaMap;
