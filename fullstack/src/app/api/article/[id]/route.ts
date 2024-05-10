import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {ResponseError, ResponseOK} from "@/types/response";

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
        },
        Comments: {
          include: {
            User: {
              select: {
                id: true, avatar: true, username: true, email: true,
                password: false, power: true, register: false, login: false,
              }
            }
          }
        }
      }
    })
    return NextResponse.json(ResponseOK(article))
  } catch (error) {
    return NextResponse.json(ResponseError('系统错误'))
  } finally {
    await prisma.$disconnect();
  }
}

export const PUT = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const { title, content } = await request.json()
    const article = await prisma.article.update({
      where: {
        id: parseInt(params.id)
      },
      data: {
        title: title,
        content: content,
        update: new Date()
      }
    })
    return NextResponse.json(ResponseOK(article))
  } catch (error) {
    return NextResponse.json(ResponseError('系统错误'))
  } finally {
    await prisma.$disconnect();
  }
}

export const DELETE = async (_request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await prisma.article.delete({
      where: {
        id: parseInt(params.id)
      }
    })
    return NextResponse.json(ResponseOK(null))
  } catch (error) {
    return NextResponse.json(ResponseError('系统错误'))
  } finally {
    await prisma.$disconnect();
  }
}
