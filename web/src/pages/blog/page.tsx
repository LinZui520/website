import { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { BlogVO } from './type';
import { listBlogs } from './api.ts';
import { useAnimatedNavigate } from '../../contexts/TransitionProvider.tsx';
import Footer from '../../components/Footer.tsx';

const Page = () => {
  const [blogs, setBlogs] = useState<BlogVO[]>();
  const containerRef = useRef<HTMLElement | null>(null);
  const navigate = useAnimatedNavigate();

  useGSAP(() => {
    gsap.from('#blog-subtitle', { opacity: 0, y: 30, duration: 1, delay: 0.4 });
  }, { scope: containerRef });

  useLayoutEffect(() => {
    if (!blogs?.length) return;
    const ctx = gsap.context(() => {
      gsap.from('.blog-card', { opacity: 0, y: 40, duration: 0.7, stagger: 0.1, ease: 'power3.out' });
    }, containerRef);
    return () => ctx.revert();
  }, [blogs]);

  useEffect(() => {
    listBlogs<BlogVO[]>().then((res) => setBlogs(res.data.data));
  }, []);

  return (
    <>
      <main className="w-screen bg-mint-50 dark:bg-mint-950 flex flex-col items-center pt-16 pb-16" ref={containerRef}>
        <div className="min-h-[calc(100vh-16rem)] flex flex-col items-center w-full max-w-7xl px-6 md:px-8">

          {/* Hero Section */}
          <div className="w-full flex flex-col items-center text-center mb-16 md:mb-24">
            <div className="text-xl md:text-2xl text-mint-500 font-light tracking-wide cursor-default group" id="blog-subtitle">
              深度学习如同呼吸般自然
              <div className={'w-full h-px origin-right group-hover:origin-left transition-transform scale-x-0 group-hover:scale-x-100 duration-500 bg-mint-950 dark:bg-mint-50'} />
            </div>
          </div>

          {/* Blog Grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12">
            {blogs?.map((blog: BlogVO) => (
              <article
                className="blog-card group cursor-pointer border border-mint-950 dark:border-mint-50 hover:border-mint-500 transition-colors duration-300"
                key={blog.blog_id}
                onClick={() => navigate(`/blog/${blog.blog_id}`)}
              >
                <div className="p-8 h-72 flex flex-col justify-between hover:bg-mint-100 dark:hover:bg-mint-900 transition-colors duration-300">

                  {/* Title */}
                  <div>
                    <h2 className="text-2xl md:text-3xl font-light tracking-tight text-mint-950 dark:text-mint-50 line-clamp-2 group-hover:text-mint-500 transition-colors duration-300">
                      {blog.title}
                    </h2>
                  </div>

                  {/* Tags — editorial */}
                  <div className="text-xs font-mono text-mint-500 tracking-widest select-none">
                    {blog.tags.slice(0, 3).map(t => t.tag_name).join(' / ')}
                    {blog.tags.length > 3 && ` / +${blog.tags.length - 3}`}
                  </div>

                  {/* Meta + Arrow */}
                  <div className="flex justify-between items-center text-sm text-mint-500 font-light">
                    <span className="tracking-wide">{blog.created_by.username}</span>
                    <div className="flex items-center gap-2">
                      <time className="font-mono tracking-tight">
                        {new Date(blog.created_at).toLocaleDateString()}
                      </time>
                      <span className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        →
                      </span>
                    </div>
                  </div>
                </div>
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
