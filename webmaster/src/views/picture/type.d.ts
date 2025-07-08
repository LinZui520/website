import type { User } from '@/stores/auth';

export interface Picture {
  id: number;
  author: number;
  filename: string;
  url: string;
  created_at: string;
}

export interface PictureDTO {
  id: number;
  author: User;
  filename: string;
  url: string;
  created_at: string;
}
