import { useEffect, useState } from 'react';
import { useRequest } from '../../hooks/useRequest.ts';
import { BlogDTO } from './type';
import { listBlogs } from './api.ts';
import { Link } from 'react-router-dom';

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
    <main className="w-screen bg-mint-50 dark:bg-mint-950 flex flex-col items-center pt-32 pb-32">
      <div className="flex flex-col items-start w-11/12 max-w-5xl">
        <div className="flex flex-row items-start justify-start">
          <div className="text-6xl text-mint-950 dark:text-mint-50 text-wrap">博客</div>
          <div className="text-xl text-mint-500 underline text-wrap w-32">深度学习如同呼吸般自然</div>
        </div>
        {blogs?.map((blog: BlogDTO) => (
          <Link
            className={
              'w-full h-24 text-6xl mt-16 rounded-3xl cursor-pointer flex flex-row justify-between items-center ' +
              'select-none group bg-mint-50 hover:bg-mint-100 dark:bg-mint-950 dark:hover:bg-mint-900'
            }
            key={blog.id}
            to={`/blog/${blog.id}`}
          >
            <div className="flex flex-row items-center">
              <svg
                className={'stroke-3 stroke-mint-950 dark:stroke-mint-50 group-hover:w-12 w-0 ml-8 group-hover:mr-8 duration-700 ease-in-out'}
                viewBox="0 0 32 32"
              >
                <path d="M 26 16 L 26 16" strokeLinecap="round" />
                <path d="M 6 16 L 26 16 M 18 8 L 26 16 M 18 24 L 26 16" />
              </svg>
              <div className="text-3xl text-mint-950 dark:text-mint-50">{blog.title}</div>
            </div>
            <div className="text-base text-mint-500 underline mr-8 flex flex-col items-end">
              <span>{blog.author.username}</span>
              <span>
                {new Date(blog.created_at).getFullYear()}-
                {String(new Date(blog.created_at).getMonth() + 1).padStart(2, '0')}-
                {String(new Date(blog.created_at).getDate()).padStart(2, '0')}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default Page;
