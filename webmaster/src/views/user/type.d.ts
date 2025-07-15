export type { User } from '@/stores/auth';

// 如果需要扩展用户信息，可以在这里定义 UserDTO
export interface UserDTO {
  id: number;
  avatar: string;
  username: string;
  email: string;
  permission: number;
}
