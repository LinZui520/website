'use client'

import Footer from "@/components/(web)/Footer";
import request from "@/lib/axios";
import { useCallback, useEffect, useState } from "react";
import { Blog } from "@/app/api/blog/route";
import Loading from "@/app/loading";
import Link from "next/link";
import ScrollBar from "@/components/ScrollBar";

const Page = () => {

  const [blogs, setBlogs] = useState<Blog[]>([])

  const fetchBlogs = useCallback(() => {
    request({
      url: '/blog', method: 'GET',
    }).then(res => setBlogs(res.data.data))
  }, [])

  useEffect(() => {
    fetchBlogs()
  }, [fetchBlogs]);


  return (
    !blogs || blogs.length === 0 ? <Loading /> :
    <>
      <div className={"w-full min-h-screen bg-[#fbfbfd] relative z-10 flex flex-col items-center"}>
        <div className={"sm:w-[90vw] md:w-[80vw] lg:w-[60vw]"}>
          <div className={"mt-[20vh] mb-[5vh] flex flex-col"}>
            <span className={"text-[#1d1d1f] text-[34px] lg:text-[44px]"}>
              博客
            </span>

            <span className={"sm:text-[18px] md:text-[21px] lg:text-[24px]"}>
              深度学习如同呼吸般自然
            </span>
          </div>

          {blogs.map((blog, index) => (
            <Link key={index} href={`/blog/${blog.id}`}>
              <div title={blog.User.username} className={"mt-[10vh] cursor-pointer hover:opacity-50 flex justify-between sm:text-[18px] md:text-[21px] lg:text-[24px]"}>
                <span className={"font-light"}>{blog.title}</span>

                <span className={""}>
                  {`${new Date(blog.create).getFullYear()}/${(new Date(blog.create).getMonth() + 1).toString().padStart(2, '0')}/${new Date(blog.create).getDate().toString().padStart(2, '0')}`}
                </span>
              </div>

              <hr className={"w-[100%] border-t border-dashed border-[#1d1d1f]"}/>
            </Link>
          ))}

          <div className={"mb-[20vh]"} />
        </div>
      </div>
      <ScrollBar />
      <Footer />
    </>
  );
}

export default Page;
