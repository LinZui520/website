import { UserVO } from '../user/type';

export interface BoardVO {
  board_id: string;
  name: string;
  description?: string;
  created_at: string;
  created_by: UserVO;
  updated_at: string;
}
