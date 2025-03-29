import { useEffect, useState } from 'react';
import { useRequest } from '../../hooks/useRequest.ts';
import { BlogDTO } from './type';
import { listBlogs } from './api.ts';

const Page = () => {
  const [blogs, setBlogs] = useState<BlogDTO[]>();
  const { handleRequest } = useRequest();

  useEffect(() => {
    handleRequest<BlogDTO[]>(
      () => listBlogs<BlogDTO[]>(),
      (res) => setBlogs(res.data.data)
    );
  }, [handleRequest]);

  return (
    <main className="w-screen bg-mint-50 dark:bg-mint-950 flex flex-col items-start p-32">
      <div className="flex flex-row items-end justify-start">
        <div className="text-6xl text-mint-950 dark:text-mint-50">博客</div>
        <div className="text-xl text-mint-500 text-wrap w-32">深度学习如同呼吸般自然</div>
      </div>
      {blogs?.map((blog: BlogDTO) => (
        <div className="mt-10" key={blog.id}>
          {blog.title}
        </div>
      ))}
    </main>
  );
};

export default Page;
