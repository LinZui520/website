import type { User } from '@/stores/auth';
import type { Tag } from '../tag/type';

export interface Blog {
  id: number;
  author: number;
  title: string;
  content: string;
  publish: boolean;
  created_at: string;
  updated_at: string;
  updated_by: number;
}

export interface BlogDTO {
  id: number;
  author: User;
  title: string;
  tags: Tag[];
  content: string;
  publish: boolean;
  created_at: string;
  updated_at: string;
  updated_by: number;
}
