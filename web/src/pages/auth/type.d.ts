
export interface User {
  id: string;
  avatar: string;
  username: string;
  email: string;
  power: number;
}

export interface UserDTO {
  user: User;
  token: string;
}
