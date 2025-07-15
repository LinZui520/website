import request from '@/utils/axios';

export const listBlogs = <T> () => request<T>({
  url: '/blog/list',
  method: 'get'
});

export const deleteBlog = (id: number) => request({
  url: `/blog/delete/${id}`,
  method: 'delete'
});

export const createBlog = <T> (title: string, content: string, category: number, publish: boolean) => request<T>({
  url: '/blog/create',
  method: 'post',
  data: {
    title,
    category,
    content,
    publish
  }
});

export const updateBlog = <T> (id: number, title: string, content: string, category: number, publish: boolean) => request<T>({
  url: `/blog/update/${id}`,
  method: 'put',
  data: {
    title,
    content,
    category,
    publish
  }
});

export const getBlog = <T> (id: number) => request<T>({
  url: `/blog/get/${id}`,
  method: 'get'
});
