import type { User } from '@/stores/auth';

export interface Photo {
  id: number;
  author: number;
  filename: string;
  url: string;
  description?: string;
  location: string;
  created_at: string;
}

export interface PhotoDTO {
  id: number;
  author: User;
  filename: string;
  url: string;
  description?: string;
  location: string;
  created_at: string;
}
