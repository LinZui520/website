import { useEffect, useRef, useState } from 'react';
import { BlogDTO } from './type';
import { listBlogs } from './api.ts';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer.tsx';

const Page = () => {
  const [blogs, setBlogs] = useState<BlogDTO[]>();
  const container = useRef<HTMLElement | null>(null);

  useEffect(() => {
    listBlogs<BlogDTO[]>().then((res) => setBlogs(res.data.data));
  }, []);

  return (
    <>
      <main className="w-screen bg-mint-50 dark:bg-mint-950 flex flex-col items-center pt-32 pb-32" ref={container}>
        <div className="min-h-[calc(100vh-384px)] flex flex-col items-start w-11/12 max-w-5xl">
          <div className="flex flex-row items-start justify-start">
            <div className="text-6xl text-mint-950 dark:text-mint-50 text-wrap">博客</div>
            <div className="text-xl text-mint-500 underline text-wrap w-32">深度学习如同呼吸般自然</div>
          </div>
          <ul className="w-full list-disc marker:text-mint-950 dark:marker:text-mint-50 flex flex-col items-center justify-center pt-16 pb-16 gap-16">
            {blogs?.map((blog: BlogDTO) => (
              <li className="w-full" key={blog.id}>
                <Link
                  className={
                    'w-full h-24 pl-8 pr-8 cursor-pointer select-none group ' +
                    'bg-mint-50 dark:bg-mint-950 flex flex-row items-center justify-between'}
                  title={blog.author.username}
                  to={`/blog/${blog.id}`}
                >
                  <div className="text-3xl font-mono text-mint-950 dark:text-mint-50 overflow-hidden">
                    <span>
                      {new Date(blog.created_at).getFullYear()}-
                      {String(new Date(blog.created_at).getMonth() + 1).padStart(2, '0')}-
                      {String(new Date(blog.created_at).getDate()).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex flex-row items-center">
                    <div className="text-3xl text-mint-950 dark:text-mint-50">{blog.title}</div>
                    <svg
                      className={'stroke-3 stroke-mint-950 dark:stroke-mint-50 group-hover:w-12 w-0 ml-8 group-hover:mr-8 duration-700 ease-in-out'}
                      viewBox="0 0 32 32"
                    >
                      <path d="M 26 16 L 26 16" strokeLinecap="round" />
                      <path d="M 6 16 L 26 16 M 18 8 L 26 16 M 18 24 L 26 16" />
                    </svg>
                  </div>
                </Link>
                <hr className="w-full border-1 border-mint-950 dark:border-mint-50" />
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Page;
