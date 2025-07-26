export type { User } from '@/stores/auth';

export interface UserVO {
  id: number;
  avatar_url: string;
  username: string;
  email: string;
  permission: number;
}
