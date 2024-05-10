import { ArticlePrisma } from "@/types/article";
import NotFound from "@/app/not-found";
import request from "@/lib/axios";

const Page = async ({ params }: { params: { id: string } }) => {

  const res = await request({
    url: `http://127.0.0.1:3000/api/article/${params.id}`,
    method: 'GET',
  })

  const article: ArticlePrisma = res.data.data

  if (!article) return <NotFound />

  return (
    <div>
      <h1>{article.title}</h1>
      <p>{article.content}</p>
      <div>{article.User.username}</div>
      <div>
        {article.Comments.map(comment => (
          <div key={comment.id}>{comment.User.username} {comment.content}</div>
        ))}
      </div>
    </div>
  );
}

export default Page;
