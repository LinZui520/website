import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ResponseError, ResponseOK } from "@/types/response";

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