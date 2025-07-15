import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BlogDTO } from '../type';
import { getBlog } from './api';
import { markdown } from '../../../utils/markdown';

const Page = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<BlogDTO>();
  const [markdownText, setMarkdownText] = useState<string>('');
  useEffect(() => {
    getBlog<BlogDTO>(Number(id)).then((res) => setBlog(res.data.data));
  }, [id]);

  useEffect(() => {
    markdown(blog?.content ?? '').then((text) => setMarkdownText(text));
  }, [blog]);

  return (
    <main className="w-full min-h-screen bg-mint-50 dark:bg-mint-950 flex flex-col items-center pt-32 pb-32">
      <div
        className="markdown-body min-h-[calc(100vh-256px)] w-11/12 max-w-4xl p-4"
        dangerouslySetInnerHTML={{ __html: markdownText }}
      />
    </main>
  );
};

export default Page;
