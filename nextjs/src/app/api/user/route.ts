import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ResponseError, ResponseOK } from "@/types/response";
import { auth } from "@/lib/auth";

export interface User {
  id: number
  avatar: string
  username: string
  email: string
  power: number
  login: string
}

export const GET = async (_request: NextRequest) => {
  try {
    const session = await auth()
    if (!session || !session.user) return NextResponse.json(ResponseError('权限不足'))
    const user = session.user
    if (user.name !== 'root' && user.name !== 'adsense') {
      return NextResponse.json(ResponseError('权限不足'))
    }

    const users = await prisma.user.findMany({
      select: {
        id: true, avatar: true, username: true, email: true,
        password: false, power: true, register: false, login: true
      }
    })
    return NextResponse.json(ResponseOK(users))
  } catch (error) {
    return NextResponse.json(ResponseError('系统错误'))
  } finally {
    await prisma.$disconnect()
  }
}