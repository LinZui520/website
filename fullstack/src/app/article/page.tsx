import { ArticlePrisma } from "@/types/article";

const Page = async () => {

  const res: Response = await fetch('http://127.0.0.1:3000/api/article')

  const articles: ArticlePrisma[] = (await res.json()).data

  return (
    <>
      {articles.map(article => (
        <div key={article.id} className={"h-[30vh]"}>{article.title} {article.User.username}</div>
      ))}
    </>
  );
}

export default Page;
