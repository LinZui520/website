import { UserVO } from '../auth/type';

export interface BoardVO {
  board_id: string,
  name: string,
  description: string | null,
  created_at: string,
  created_by: UserVO,
  updated_at: string,
}

export interface OutletContext {
  boards: BoardVO[];
}
