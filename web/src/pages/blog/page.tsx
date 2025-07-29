import { useEffect, useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { BlogVO } from './type';
import { listBlogs } from './api.ts';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer.tsx';

const Page = () => {
  const [blogs, setBlogs] = useState<BlogVO[]>();
  const containerRef = useRef<HTMLElement | null>(null);

  useGSAP(() => {
    gsap.from('#blog-title', { opacity: 0, y: 50, duration: 1, delay: 0 });
    gsap.from('#blog-subtitle', { opacity: 0, y: 30, duration: 1, delay: 0.4 });
    gsap.from('.blog-card', { opacity: 0, y: 30, duration: 1, delay: 0.8 });
  }, { scope: containerRef });

  useEffect(() => {
    listBlogs<BlogVO[]>().then((res) => setBlogs(res.data.data));
  }, []);

  return (
    <>
      <main className="w-screen bg-mint-50 dark:bg-mint-950 flex flex-col items-center pt-16 pb-16" ref={containerRef}>
        <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center w-full max-w-7xl px-6 md:px-8">

          {/* Hero Section */}
          <div className="w-full flex flex-col items-center text-center mb-16 md:mb-24">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif tracking-tight text-mint-950 dark:text-mint-50 mb-6 cursor-default" id="blog-title">
              博客
            </h1>
            <div className="text-xl md:text-2xl text-mint-500 font-light tracking-wide cursor-default group" id="blog-subtitle">
              深度学习如同呼吸般自然
              <div
                className={'w-full h-px origin-right group-hover:origin-left transition-transform scale-x-0 group-hover:scale-x-100 duration-500 bg-mint-950 dark:bg-mint-50'}
              />
            </div>
          </div>

          {/* Blog Grid */}
          <div className="blog-card w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12">
            {blogs?.map((blog: BlogVO) => (
              <article
                className="group cursor-pointer bg-mint-50 dark:bg-mint-950 border border-mint-950 dark:border-mint-50 hover:border-mint-500 transition-all duration-300 hover:shadow-lg"
                key={blog.blog_id}
              >
                <Link
                  className="p-8 h-72 flex flex-col justify-between hover:bg-mint-100 dark:hover:bg-mint-900 transition-colors duration-300"
                  title={`${blog.title} - ${blog.created_by.username}`}
                  to={`/blog/${blog.blog_id}`}
                >
                  {/* Title */}
                  <div className="mb-4">
                    <h2 className="text-2xl md:text-3xl font-light tracking-tight text-mint-950 dark:text-mint-50 line-clamp-2 group-hover:text-mint-500 transition-colors duration-300">
                      {blog.title}
                    </h2>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {blog.tags.slice(0, 3).map((tag) => (
                      <span
                        className="px-3 py-1 text-xs font-mono bg-mint-500 text-mint-50 rounded-full tracking-wide"
                        key={tag.tag_id}
                      >
                        {tag.tag_name}
                      </span>
                    ))}
                    {blog.tags.length > 3 && (
                      <span className="px-3 py-1 text-xs font-mono text-mint-500 border border-mint-500 rounded-full">
                        +{blog.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex justify-between items-center text-sm text-mint-500 font-light">
                    <span className="tracking-wide">{blog.created_by.username}</span>
                    <time className="font-mono tracking-tight">
                      {new Date(blog.created_at).toLocaleDateString()}
                    </time>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Page;
