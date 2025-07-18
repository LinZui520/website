import { User } from '../auth/type';

export interface Tag {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface BlogDTO {
  id: number;
  author: User,
  title: string;
  tags: Tag[];
  content: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  updated_by: number;
}
