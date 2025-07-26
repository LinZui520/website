
export interface UserVO {
  id: number;
  avatar_url: string;
  username: string;
  email: string;
  permission: number;
}

export interface AuthVO {
  user: UserVO;
  token: string;
}
