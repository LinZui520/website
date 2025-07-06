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
      <main className="w-screen bg-mint-50 dark:bg-mint-950 flex flex-col items-center pt-32" ref={container}>
        <div className="min-h-[calc(100vh-12rem)] md:min-h-[calc(100vh-16rem)] flex flex-col items-start w-11/12 max-w-5xl">
          <div className="w-full flex flex-col items-start justify-start gap-4">
            <div className="text-6xl text-mint-950 dark:text-mint-50 font-mono">BLOG</div>
            <div className="text-xl text-mint-500 underline">深度学习如同呼吸般自然</div>
          </div>
          <ul className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 pt-16 pb-16 gap-16">
            {blogs?.map((blog: BlogDTO) => (
              <li className="border-2 border-mint-950 dark:border-mint-50 hover:-translate-y-4 transition-transform duration-300 ease-in-out" key={blog.id}>
                <Link
                  className={
                    'h-48 p-6 cursor-pointer select-none group hover:bg-mint-100 dark:hover:bg-mint-900 ' +
                    'bg-mint-50 dark:bg-mint-950 flex flex-col justify-between'}
                  title={`${blog.title} - ${blog.author.username}`}
                  to={`/blog/${blog.id}`}
                >
                  <div className="flex flex-col items-start gap-3">
                    <h3 className="text-lg font-medium text-mint-950 dark:text-mint-50 line-clamp-2 group-hover:text-mint-500 transition-colors duration-200">
                      {blog.title}
                    </h3>
                    <span className="px-2 py-1 text-xs bg-mint-500 text-mint-50 rounded font-mono">
                      {blog.category.name}
                    </span>
                  </div>
                  <div className="flex flex-row justify-between items-center text-sm text-mint-500">
                    <span className="underline">{blog.author.username}</span>
                    <time className="font-mono">
                      {new Date(blog.created_at).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })}
                    </time>
                  </div>
                </Link>
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
