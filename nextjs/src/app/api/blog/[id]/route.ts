import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ResponseError, ResponseOK } from "@/types/response";
import { auth } from "@/lib/auth";

export interface Blog {
  id: number
  author: number
  title: string
  content: string
  update: string
  create: string
  User: {
    id: number
    avatar: string
    username: string
    email: string
    power: number
  }
  Comments: {
    id: number
    author: number
    article: number
    content: string
    create: string
    User: {
      id: number
      avatar: string
      username: string
      email: string
      power: number
    }
  }[]
}

export const GET = async (_request: NextRequest, { params }: { params: { id: string } }) => {
  try {
     const blog = await prisma.blog.findUnique({
      where: {
        id: Number(params.id)
      },
      select: {
        id: true, author: true,
        title: true, content: true,
        update: true, create: true,
        User: {
          select: {
            id: true, avatar: true, username: true, email: true,
            password: false, power: true, register: false, login: false,
          }
        },
        Comments: {
          select: {
            id: true, author: true, blog: true,
            content: true, create: true,
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
    return NextResponse.json(ResponseOK(blog))
  } catch (error) {
    return NextResponse.json(ResponseError('系统错误'))
  } finally {
    await prisma.$disconnect();
  }
}

export const PUT = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const session = await auth()
    if (!session || !session.user) return NextResponse.json(ResponseError('权限不足'))
    const role = session.user.name
    if (role === "block") return NextResponse.json(ResponseError('权限不足'))

    const { title, content } = await request.json()
    const blog = await prisma.blog.findUnique({ where: { id: Number(params.id) } })
    if (!blog) return NextResponse.json(ResponseError('权限不足'))
    if (blog.author !== Number(session.user.id) && role !== "admin" && role !== "root" && role !== "adsense") return NextResponse.json(ResponseError('权限不足'))


    await prisma.blog.update({
      where: {
        id: Number(params.id)
      },
      data: {
        title: title,
        content: content,
        update: new Date()
      }
    })
    return NextResponse.json(ResponseOK(null))
  } catch (error) {
    return NextResponse.json(ResponseError('系统错误'))
  } finally {
    await prisma.$disconnect();
  }
}

export const DELETE = async (_request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const session = await auth()
    if (!session || !session.user) return NextResponse.json(ResponseError('权限不足'))
    const role = session.user.name
    if (role === "block") return NextResponse.json(ResponseError('权限不足'))

    const blog = await prisma.blog.findUnique({ where: { id: Number(params.id) } })
    if (!blog) return NextResponse.json(ResponseError('权限不足'))
    if (blog.author !== Number(session.user.id) && role !== "admin" && role !== "root" && role !== "adsense") return NextResponse.json(ResponseError('权限不足'))

    await prisma.blog.delete({
      where: {
        id: Number(params.id)
      }
    })
    return NextResponse.json(ResponseOK(null))
  } catch (error) {
    return NextResponse.json(ResponseError('系统错误'))
  } finally {
    await prisma.$disconnect();
  }
}
