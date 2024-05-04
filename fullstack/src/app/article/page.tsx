import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const Page = async () => {

  const articles = await prisma.article.findMany()

  return (
    <>
      {articles.map(article => (
        <div key={article.id}>{article.title}</div>
      ))}
    </>
  );
}

export default Page;
