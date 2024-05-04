import { Article, User } from "@prisma/client";
import { CommentPrisma } from "@/type/comment";

export interface ArticlePrisma extends Article {
  User: User;
  Comments: CommentPrisma[]
}
