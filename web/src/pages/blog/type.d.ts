import { User } from '../auth/type';

export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface BlogDTO {
  id: number;
  author: User,
  title: string;
  category: Category;
  content: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  updated_by: number;
}
