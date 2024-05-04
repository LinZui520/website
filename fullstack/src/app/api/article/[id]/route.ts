import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {ResponseError, ResponseOK} from "@/type/response";

export const GET = async (_request: NextRequest, { params }: { params: { id: string } }) => {
  try {
     const article = await prisma.article.findFirst({
      where: {
        id: parseInt(params.id)
      },
      include: {
        user: true
      }
    })
    return NextResponse.json(ResponseOK(article))
  } catch (error) {

  } finally {
    await prisma.$disconnect();
  }

  return NextResponse.json(ResponseError('文章不存在'))
}