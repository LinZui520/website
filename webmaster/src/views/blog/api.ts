import request from '@/utils/axios';

export const listBlogs = <T> () => request<T>({
  url: '/blog',
  method: 'get'
});

export const deleteBlog = (id: number) => request({
  url: `/blog/${id}`,
  method: 'delete'
});

export const createBlog = <T> (title: string, content: string, tags: number[], publish: boolean) => request<T>({
  url: '/blog',
  method: 'post',
  data: {
    title,
    tag_ids: tags,
    content,
    publish
  }
});

export const updateBlog = <T> (id: number, title: string, content: string, tags: number[], publish: boolean) => request<T>({
  url: `/blog/${id}`,
  method: 'put',
  data: {
    title,
    content,
    tag_ids: tags,
    publish
  }
});

export const getBlog = <T> (id: number) => request<T>({
  url: `/blog/${id}`,
  method: 'get'
});
