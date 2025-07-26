import request from '@/utils/axios';

export const readBlogs = <T> () => request<T>({
  url: '/blog',
  method: 'get'
});

export const deleteBlog = (id: string) => request({
  url: `/blog/${id}`,
  method: 'delete'
});

export const createBlog = <T> (title: string, content: string, tags: string[], publish: boolean) => request<T>({
  url: '/blog',
  method: 'post',
  data: {
    title,
    tag_ids: tags,
    content,
    publish
  }
});

export const updateBlog = <T> (id: string, title: string, content: string, tags: string[], publish: boolean) => request<T>({
  url: `/blog/${id}`,
  method: 'put',
  data: {
    title,
    content,
    tag_ids: tags,
    publish
  }
});

export const readBlog = <T> (id: string) => request<T>({
  url: `/blog/${id}`,
  method: 'get'
});
