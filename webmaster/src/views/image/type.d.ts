import type { User } from '@/stores/auth';

export interface Image {
  id: number;
  author: number;
  filename: string;
  url: string;
  created_at: string;
}

export interface ImageDTO {
  id: number;
  author: User;
  filename: string;
  url: string;
  created_at: string;
}
