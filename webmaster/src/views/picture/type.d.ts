import type { UserVO } from '@/stores/auth';

export interface PictureVO {
  picture_id: string,
  picture_url: string,
  created_at: string,
  created_by: UserVO,
  updated_at: string,
}
