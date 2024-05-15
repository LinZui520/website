import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ResponseError, ResponseOK } from "@/types/response";
import {auth} from "@/lib/auth";

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
}

export const GET = async (_request: NextRequest) => {
  try {
    const blogs = await prisma.blog.findMany({
      select: {
        id: true, author: true, title: true, content: false, update: true, create: true,
        User: {
          select: {
            id: true, avatar: true, username: true, email: true,
            password: false, power: true, register: false, login: false,
          }
        }
      },
      orderBy: { create: 'desc' }
    })
    return NextResponse.json(ResponseOK(blogs))
  } catch (error) {
    return NextResponse.json(ResponseError('系统错误'))
  } finally {
    await prisma.$disconnect();
  }
}

export const POST = async (request: NextRequest) => {
  try {
    const session = await auth()
    if (!session || !session.user) return NextResponse.json(ResponseError('权限不足'))
    const role = session.user.name
    if (role === "block") return NextResponse.json(ResponseError('权限不足'))

    const { title, content } = await request.json()
    await prisma.blog.create({
      data: {
        author: Number(session.user.id),
        title: title.toString(),
        content: content.toString(),
        update: new Date(),
        create: new Date()
      }
    })
    return NextResponse.json(ResponseOK(null))
  } catch (error) {
    return NextResponse.json(ResponseError('系统错误'))
  } finally {
    await prisma.$disconnect();
  }
}
