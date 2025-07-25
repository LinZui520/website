import { Dispatch, SetStateAction } from 'react';
import { ChinaGeoJSONCollection, GeoJSONCollection } from '../../components/trail/type';
import { User } from '../auth/type';

export interface Photo {
  id: number;
  author: number;
  filename: string;
  url: string;
  description?: string;
  location: string;
  created_at: string;
}

export interface PhotoDTO {
  id: number;
  author: User;
  filename: string;
  url: string;
  description?: string;
  location: string;
  created_at: string;
}

// 定义 context 类型
export interface OutletContext {
  geoData: ChinaGeoJSONCollection | null;
  globalGeoData: GeoJSONCollection | null;
  photos: PhotoDTO[],
  isGlobal: boolean;
  setIsGlobal: Dispatch<SetStateAction<boolean>>;
}
