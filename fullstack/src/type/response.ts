import {Article, Conversation, Image, Message, User} from "@prisma/client";

type data = null |
  User | User[] |
  Article | Article[] |
  Comment | Comment[] |
  Image | Image[] |
  Message | Message[] |
  Conversation | Conversation[]

export interface Response {
  code: number;
  message: string;
  data: data;
}

export const ResponseOK = (data: data): Response => ({
  code: 200,
  message: '成功',
  data
})


export const ResponseError = (message: string): Response => ({
  code: 400,
  message,
  data: null
})