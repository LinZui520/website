import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {ResponseError, ResponseOK} from "@/types/response";

export const GET = async (_request: NextRequest) => {
  try {
    const articles = await prisma.article.findMany({
      include: {
        User: {
          select: {
            id: true, avatar: true, username: true, email: true,
            password: false, power: true, register: false, login: false,
          }
        }
      }
    })
    return NextResponse.json(ResponseOK(articles))
  } catch (error) {
    return NextResponse.json(ResponseError('系统错误'))
  } finally {
    await prisma.$disconnect();
  }
}