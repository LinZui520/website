import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BlogVO } from '../type';
import { getBlog } from './api';
import { markdown } from '../../../utils/markdown';
import BackArrow from '../../../components/BackArrow';
import UpArrow from '../../../components/UpArrow';

const Page = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<BlogVO>();
  const [markdownText, setMarkdownText] = useState<string>('');
  useEffect(() => {
    if (!id) { return; }
    getBlog<BlogVO>(id).then((res) => setBlog(res.data.data));
  }, [id]);

  useEffect(() => {
    markdown(blog?.content ?? '').then((text) => setMarkdownText(text));
  }, [blog]);

  return (
    <main className="w-full min-h-screen bg-mint-50 dark:bg-mint-950 flex flex-col items-center pt-32 pb-32">
      <div className="min-h-[calc(100vh-256px)] w-11/12 max-w-4xl flex flex-col">
        {/* 标题区域 */}
        <h1 className="text-4xl font-bold text-mint-950 dark:text-mint-50 mb-8">
          {blog?.title}
        </h1>

        {/* 头像和用户名 */}
        <div className="flex items-center gap-3 mb-4">
          <img
            alt={blog?.created_by.username}
            className="w-10 h-10 rounded-full object-cover"
            src={blog?.created_by.avatar_url}
          />
          <span className="text-2xl text-mint-900 dark:text-mint-100">
            {blog?.created_by.username}
          </span>
        </div>

        {/* 标签区域 */}
        <div className="flex flex-row flex-wrap gap-2 mb-8">
          {blog?.tags?.map((tag) => (
            <span className="px-2 py-1 text-xs bg-mint-500 text-mint-50 rounded font-mono max-w-48 truncate" key={tag.tag_id}>
              {tag.tag_name}
            </span>
          ))}
        </div>

        <div
          className="markdown-body p-4 flex-1"
          dangerouslySetInnerHTML={{ __html: markdownText }}
        />
      </div>
      <UpArrow />
      <BackArrow />
    </main>
  );
};

export default Page;
