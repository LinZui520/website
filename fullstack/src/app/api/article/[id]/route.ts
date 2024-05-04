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
        User: {
          select: {
            id: true, avatar: true, username: true, email: true,
            password: false, power: true, register: false, login: false,
          }
        }
      }
    })
    if (!article) return NextResponse.json(ResponseError('文章不存在'))
    return NextResponse.json(ResponseOK(article))
  } catch (error) {
    return NextResponse.json(ResponseError('网络错误'))
  } finally {
    await prisma.$disconnect();
  }
}

export const PUT = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const formData = await request.formData()
    const article = await prisma.article.update({
      where: {
        id: parseInt(params.id)
      },
      data: {
        title: String(formData.get('title')) ,
        content: String(formData.get('content')),
        update: new Date()
      }
    })
    return NextResponse.json(ResponseOK(article))
  } catch (error) {
    return NextResponse.json(ResponseError('文章不存在'))
  } finally {
    await prisma.$disconnect();
  }
}