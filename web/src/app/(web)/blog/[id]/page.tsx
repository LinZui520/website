'use client'

import { MdPreview, config } from "md-editor-rt";
import 'md-editor-rt/lib/style.css';
import MarkExtension from "markdown-it-mark";
import { useCallback, useEffect, useState } from "react";
import request from "@/lib/axios";
import Loading from "@/app/loading";
import NotFound from "@/app/not-found";
import { Blog } from "@/app/api/blog/[id]/route";
import Footer from "@/components/(web)/Footer";
import GlobalScrollBar from "@/components/GlobalScrollBar";

config({
  markdownItConfig(md) {
    md.use(MarkExtension);
  }
})

const Page = ({ params }: { params: { id: string } }) => {

  const [blog, setBlog] = useState<Blog | null>()

  const fetchBlog = useCallback(() => {
    request({
      url: `/blog/${params.id}`,
      method: 'GET',
    }).then(res => setBlog(res.data.data))
  }, [params.id])

  useEffect(() => {
    fetchBlog()
  }, [fetchBlog])

  if (blog === undefined) return <Loading />

  if (blog === null) return <NotFound />

  return (
    <>
      <div className={"w-full min-h-screen relative z-10 bg-[#fbfbfd] flex flex-row justify-center"}>
        <MdPreview editorId={'MdCatalog'} className={"w-[80%] max-w-[825px]"} modelValue={blog.content}/>
      </div>
      <GlobalScrollBar />
      <Footer />
    </>
  );
}

export default Page;
