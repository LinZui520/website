import { UserVO } from '../../auth/type';

export interface ParentCommentVO {
  comment_id: string,
  content: string,
  target_id: string,
}

export interface CommentVO {
  comment_id: string;
  content: string;
  target_id: string;
  parent: ParentCommentVO | null;
  created_at: string;
  created_by: UserVO;
  updated_at: string;
}
