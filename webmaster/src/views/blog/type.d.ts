import type { User } from '@/stores/auth';
import type { Category } from '../category/type';

export interface Blog {
  id: number;
  author: number;
  title: string;
  category: number;
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
  category: Category;
  content: string;
  publish: boolean;
  created_at: string;
  updated_at: string;
  updated_by: number;
}
