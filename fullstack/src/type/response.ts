import { Article, Conversation, Image, Message, User } from "@prisma/client";

type data = null |
  User | User[] |
  Article | Article[] |
  Comment | Comment[] |
  Image | Image[] |
  Message | Message[] |
  Conversation | Conversation[]

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