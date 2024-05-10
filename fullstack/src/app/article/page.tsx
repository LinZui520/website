import { ArticlePrisma } from "@/types/article";
import request from "@/lib/axios";

const Page = async () => {

  const res = await request({
    url: 'http://127.0.0.1:3000/api/article',
    method: 'GET',
  })

  const articles: ArticlePrisma[] = res.data.data

  return (
    <>
      {articles?.map(article => (
        <div key={article.id} className={"h-[30vh]"}>{article.title} {article.User.username}</div>
      ))}
    </>
  );
}

export default Page;
