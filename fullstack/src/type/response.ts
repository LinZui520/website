import {Article} from "@prisma/client";

export interface Response {
  code: number;
  message: string;
  data: Article | Article[] | null;
}

export const ResponseOK = (data: Article | Article[] | null): Response => ({
  code: 200,
  message: '成功',
  data
})


export const ResponseError = (message: string): Response => ({
  code: 400,
  message,
  data: null
})