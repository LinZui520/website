import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ResponseError, ResponseOK } from "@/types/response";
import { session } from "@/utils/session";

export interface Message {
  id: number
  author: string
  content: string
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
    const { id, role } = await session()
    if (role === "block" || !id) return NextResponse.json(ResponseError('权限不足'))

    const messages = await prisma.message.findMany({
      select: {
        id: true, author: true, content: true, create: true,
        User: {
          select: {
            id: true, avatar: true, username: true, email: true,
            password: false, power: true, register: false, login: false,
          }
        }
      },
      orderBy: { create: 'desc' }
    })
    return NextResponse.json(ResponseOK(messages))
  } catch (error) {
    return NextResponse.json(ResponseError('系统错误'))
  }
}

export const POST =  async (request: NextRequest) => {
  try {
    const { id, role } = await session()
    if (role === "block" || !id) return NextResponse.json(ResponseError('权限不足'))

    const { content } = await request.json()
    if (!content) return NextResponse.json(ResponseError('参数错误'))

    await prisma.message.create({
      data: {
        author: Number(id),
        content: content.toString(),
        create: new Date()
      }
    })

    return NextResponse.json(ResponseOK(null))
  } catch (error) {
    return NextResponse.json(ResponseError('系统错误'))
  }
}
