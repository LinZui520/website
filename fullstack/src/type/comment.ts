import { Article, Comment, User } from "@prisma/client";

export interface CommentPrisma extends Comment {
  User: User;
  Article: Article
}