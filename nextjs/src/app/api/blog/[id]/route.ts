import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ResponseError, ResponseOK } from "@/types/response";
import { session } from "@/utils/session";

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
  }
}

const checkBlog = async (id: string, role: string, params: { id: string }) => {
  const blog = await prisma.blog.findUnique({ where: { id: Number(params.id) } })
  if (!blog) return '博客不存在'
  if (blog.author !== Number(id) && role !== "admin" && role !== "root" && role !== "adsense") return '权限不足'
  return null
}

export const PUT = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const { id, role } = await session()
    if (role === "block" || !id) return NextResponse.json(ResponseError('权限不足'))

    const { title, content } = await request.json()
    if (!title) return NextResponse.json(ResponseError('参数错误'))

    const message = await checkBlog(id, role, params)
    if (message) return NextResponse.json(ResponseError(message))

    await prisma.blog.update({
      where: {
        id: Number(params.id)
      },
      data: {
        title: title,
        content: content,
        update: new Date(+new Date() + 8 * 3600 * 1000)
      }
    })
    return NextResponse.json(ResponseOK(null))
  } catch (error) {
    return NextResponse.json(ResponseError('系统错误'))
  }
}

export const DELETE = async (_request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const { id, role } = await session()
    if (role === "block" || !id) return NextResponse.json(ResponseError('权限不足'))

    const message = await checkBlog(id, role, params)
    if (message) return NextResponse.json(ResponseError(message))

    await prisma.blog.delete({
      where: {
        id: Number(params.id)
      }
    })
    return NextResponse.json(ResponseOK(null))
  } catch (error) {
    return NextResponse.json(ResponseError('系统错误'))
  }
}
