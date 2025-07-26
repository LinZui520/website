import type { UserVO } from '@/stores/auth';
import type { TagVO } from '../tag/type';

export interface BlogVO {
  blog_id: string;
  title: string;
  content: string;
  publish: boolean;
  tags: TagVO[];
  created_at: string;
  created_by: UserVO;
  updated_at: string;
  updated_by: number;
}
