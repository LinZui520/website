// 数据来源: https://enjalot.github.io/wwsd/data/world/world-110m.geojson
export interface GeoJSONFeature {
  type: 'Feature';
  properties: {
    name: string;
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
  id: string;
}

export interface GeoJSONCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

// 数据来源: https://github.com/longwosion/geojson-map-china/blob/master/china.json
export interface ChinaGeoJSONFeature {
  type: 'Feature';
  properties: {
    id: string;
    size: string;
    name: string;
    cp: [number, number];
    childNum: number;
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}
export interface ChinaGeoJSONCollection {
  type: 'FeatureCollection';
  features: ChinaGeoJSONFeature[];
}
