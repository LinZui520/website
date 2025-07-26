import type { UserVO } from '@/stores/auth';

export interface PhotoVO {
  photo_id: string;
  photo_url: string;
  description?: string;
  location: string;
  created_at: string;
  created_by: UserVO;
  updated_at: string;
}
