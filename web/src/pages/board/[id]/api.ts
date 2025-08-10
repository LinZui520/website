import request from '../../../utils/axios';

export const createComment = <T> (content: string, target_id: string, parent_id: string | null) => request<T>({
  url: `/comment`,
  method: 'post',
  data: {
    content,
    target_id,
    parent_id
  }
});

export const readComment = <T> (targer_id: string) => request<T>({
  url: `/comment/target/${targer_id}`,
  method: 'get'
});

export const deleteComment = <T> (comment_id: string) => request<T>({
  url: `/comment/${comment_id}`,
  method: 'delete'
});
