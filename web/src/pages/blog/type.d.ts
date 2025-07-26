import { UserVO } from '../auth/type';

export interface TagVO {
  tag_id: number;
  tag_name: string;
}

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
