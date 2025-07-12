import React, { useState, useEffect } from 'react';
import { GeoJSONCollection } from './type';
import { calculateBounds, convertGeoJSONToSVGPath } from './geo';

interface WorldMapProps {
  visitedCountries?: string[];
  onCountryClick?: (country: string) => void;
  className?: string;
}

const WorldMap: React.FC<WorldMapProps> = ({
  visitedCountries = [],
  onCountryClick,
  className = ''
}) => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [geoData, setGeoData] = useState<GeoJSONCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGeoJSON = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/world-110m.geojson');

        if (!response.ok) {
          throw new Error(`加载失败: ${response.status} ${response.statusText}`);
        }

        const data: GeoJSONCollection = await response.json();

        if (!data.features || data.features.length === 0) {
          throw new Error('GeoJSON文件中没有找到地理数据');
        }

        setGeoData(data);
      } catch (err) {
        console.error('加载GeoJSON文件失败:', err);
        setError(err instanceof Error ? err.message : '未知错误');
      } finally {
        setLoading(false);
      }
    };

    loadGeoJSON();
  }, []);

  const getCountryFill = (country: string) => {
    if (visitedCountries.includes(country)) {
      return '#10b981';
    }
    if (hoveredCountry === country) {
      return '#3b82f6';
    }
    return '#e5e7eb';
  };

  // 加载状态
  if (loading) {
    return (
      <div className={`w-full ${className}`}>
        <div className="w-full h-64 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">正在加载世界地图数据...</p>
          </div>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error || !geoData) {
    return (
      <div className={`w-full ${className}`}>
        <div className="w-full h-64 border border-red-200 rounded-lg bg-red-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 text-lg font-medium mb-2">地图加载失败</div>
            <p className="text-red-500 text-sm mb-4">{error || '未知错误'}</p>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              onClick={() => window.location.reload()}
            >
              重新加载
            </button>
          </div>
        </div>
      </div>
    );
  }

  const bounds = calculateBounds(geoData.features);

  return (
    <div className={`w-full ${className}`}>
      <svg
        className="w-full h-auto border border-gray-200 rounded-lg bg-blue-50"
        style={{ aspectRatio: '5/3' }}
        viewBox="0 0 1000 600"
      >
        <rect fill="#dbeafe" height="600" width="1000" />

        {geoData.features.map((feature, index) => {
          const countryName = feature.properties.name;
          const countryPath = convertGeoJSONToSVGPath(feature.geometry.coordinates, bounds, { padding: 30, svgWidth: 1000, svgHeight: 600 });

          if (!countryPath) return null;

          return (
            <path
              className="transition-all duration-200 cursor-pointer hover:stroke-2"
              d={countryPath}
              fill={getCountryFill(countryName)}
              key={feature.id || `country-${index}`}
              onClick={() => onCountryClick?.(countryName)}
              onMouseEnter={() => setHoveredCountry(countryName)}
              onMouseLeave={() => setHoveredCountry(null)}
              stroke="#ffffff"
              strokeWidth="0.5"
            />
          );
        })}

        {hoveredCountry && (
          <text
            className="fill-[#1f2937] text-base font-bold pointer-events-none"
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
