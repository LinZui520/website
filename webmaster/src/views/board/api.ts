import request from '@/utils/axios';

export const listBoards = <T> () => request<T>({
  url: '/board',
  method: 'get'
});

export const deleteBoard = (id: string) => request({
  url: `/board/${id}`,
  method: 'delete'
});

export const createBoard = (name: string, description?: string) => request({
  url: '/board',
  method: 'post',
  data: { name, description }
});

export const getBoard = <T> (id: string) => request<T>({
  url: `/board/${id}`,
  method: 'get'
});

export const updateBoard = (id: string, name: string, description?: string) => request({
  url: `/board/${id}`,
  method: 'put',
  data: { name, description }
});
