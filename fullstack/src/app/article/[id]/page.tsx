import { ArticlePrisma } from "@/types/article";

const Page = async ({ params }: { params: { id: string } }) => {

  const res: Response = await fetch(`http://127.0.0.1:3000/api/article/${params.id}`)
  const article: ArticlePrisma = (await res.json()).data

  return (
    <div>
      <h1>{article.title}</h1>
      <p>{article.content}</p>
      <div>{article.User.username}</div>
      <div>
        {article.Comments.map(comment => (
          <div key={comment.id}>{comment.content}</div>
        ))}
      </div>
    </div>
  );
}

export default Page;
