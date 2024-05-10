import { Article, Conversation, Image, Message, User } from "@prisma/client";
import {ArticlePrisma} from "@/types/article";
import {CommentPrisma} from "@/types/comment";
import { UserPrisma } from "@/types/user";

type data = null
  | User | User[] | UserPrisma | UserPrisma[]
  | Article | Article[] | ArticlePrisma | ArticlePrisma[]
  | Comment | Comment[] | CommentPrisma | CommentPrisma[]
  | Image | Image[]
  | Message | Message[]
  | Conversation | Conversation[]

export interface ApiResponse {
  code: number;
  message: string;
  data: data;
}

export const ResponseOK = (data: data): ApiResponse => ({
  code: 200,
  message: 'success',
  data
})


export const ResponseError = (message: string): ApiResponse => ({
  code: 400,
  message,
  data: null
})