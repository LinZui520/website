import { ChinaGeoJSONFeature, GeoJSONFeature } from './type';

export const calculateBounds = (features: GeoJSONFeature[] | ChinaGeoJSONFeature[]) => {
  let minLon = Infinity;
  let maxLon = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  features.forEach(feature => {
    const { coordinates } = feature.geometry;

    const processCoords = (coords: number[][]) => {
      coords.forEach(([lon, lat]) => {
        if (typeof lon === 'number' && typeof lat === 'number') {
          minLon = Math.min(minLon, lon);
          maxLon = Math.max(maxLon, lon);
          minLat = Math.min(minLat, lat);
          maxLat = Math.max(maxLat, lat);
        }
      });
    };

    if (feature.geometry.type === 'Polygon') {
      const polygon = coordinates as number[][][];
      if (polygon.length > 0 && polygon[0]) {
        processCoords(polygon[0]);
      }
    } else if (feature.geometry.type === 'MultiPolygon') {
      const multiPolygon = coordinates as number[][][][];
      multiPolygon.forEach((polygon) => {
        if (polygon.length > 0 && polygon[0]) {
          processCoords(polygon[0]);
        }
      });
    }
  });

  return { minLon, maxLon, minLat, maxLat };
};

export const convertGeoJSONToSVGPath = (
  coordinates: number[][][] | number[][][][],
  bounds: { minLon: number; maxLon: number; minLat: number; maxLat: number },
  config: { padding: number; svgWidth: number; svgHeight: number }
): string => {
  const { minLon, maxLon, minLat, maxLat } = bounds;

  const lonRange = maxLon - minLon;
  const latRange = maxLat - minLat;
  const scaleX = (config.svgWidth - 2 * config.padding) / lonRange;
  const scaleY = (config.svgHeight - 2 * config.padding) / latRange;
  const scale = Math.min(scaleX, scaleY);

  const offsetX = config.padding + (config.svgWidth - 2 * config.padding - lonRange * scale) / 2;
  const offsetY = config.padding + (config.svgHeight - 2 * config.padding - latRange * scale) / 2;

  const processRing = (coords: number[][]): string => {
    if (!coords || coords.length === 0) return '';

    const pathCommands = coords.map((coord, index) => {
      const [lon, lat] = coord;
      const x = (lon - minLon) * scale + offsetX;
      const y = (maxLat - lat) * scale + offsetY;
      return index === 0 ? `M${x.toFixed(1)},${y.toFixed(1)}` : `L${x.toFixed(1)},${y.toFixed(1)}`;
    });

    pathCommands.push('Z');
    return pathCommands.join(' ');
  };

  if (coordinates.length > 0 && Array.isArray(coordinates[0])) {
    if (Array.isArray(coordinates[0][0]) && typeof coordinates[0][0][0] === 'number') {
      const polygon = coordinates as number[][][];
      const paths: string[] = [];
      polygon.forEach((ring) => {
        const path = processRing(ring);
        if (path) paths.push(path);
      });
      return paths.join(' ');
    } else if (Array.isArray(coordinates[0][0]) && Array.isArray(coordinates[0][0][0]) &&
      typeof coordinates[0][0][0][0] === 'number') {
      const multiPolygon = coordinates as number[][][][];
      const paths: string[] = [];
      multiPolygon.forEach((polygon) => {
        polygon.forEach((ring) => {
          const path = processRing(ring);
          if (path) paths.push(path);
        });
      });
      return paths.join(' ');
    }
  }

  return '';
};
