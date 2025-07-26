import { Dispatch, SetStateAction } from 'react';
import { ChinaGeoJSONCollection, GeoJSONCollection } from '../../components/trail/type';
import { UserVO } from '../auth/type';

export interface PhotoVO {
  photo_id: string;
  photo_url: string;
  description?: string;
  location: string;
  created_at: string;
  created_by: UserVO;
  updated_at: string;
}

// 定义 context 类型
export interface OutletContext {
  geoData: ChinaGeoJSONCollection | null;
  globalGeoData: GeoJSONCollection | null;
  photos: PhotoDTO[],
  isGlobal: boolean;
  setIsGlobal: Dispatch<SetStateAction<boolean>>;
}
