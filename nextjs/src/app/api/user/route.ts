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
    const role = session.user.name
    if (role !== 'root' && role !== 'adsense') {
      return NextResponse.json(ResponseError('权限不足'))
    }

    const users = await prisma.user.findMany({
      select: {
        id: true, avatar: true, username: true, email: true,
        password: false, power: true, register: false, login: true
      },
      orderBy: { register: 'desc' }
    })
    return NextResponse.json(ResponseOK(users))
  } catch (error) {
    return NextResponse.json(ResponseError('系统错误'))
  }
}

export const PUT = async (request: NextRequest) => {
  try {
    const session = await auth()
    if (!session || !session.user) return NextResponse.json(ResponseError('权限不足'))
    const role = session.user.name
    if (role === "block" || role === "user") return NextResponse.json(ResponseError('权限不足'))


    const { id, action } = await request.json()
    const user = await prisma.user.findUnique({
      where: { id: Number(id) }
    })
    if (!user) return NextResponse.json(ResponseError('用户不存在'))

    const power = role === 'adsense' ? 3 : role === 'root' ? 2 : 1;

    switch (action) {
      case 'block':
        if (power <= user.power) return NextResponse.json(ResponseError('权限不足'))
        await prisma.user.update({
          where: { id: Number(id) },
          data: { power: user.power - 1 }
        })
        return NextResponse.json(ResponseOK('操作成功'))
      case 'boost':
        if (power <= user.power + 1) return NextResponse.json(ResponseError('权限不足'))
        await prisma.user.update({
          where: { id: Number(id) },
          data: { power: user.power + 1 }
        })
        return NextResponse.json(ResponseOK('操作成功'))
      default:return NextResponse.json(ResponseError("未知操作"))
    }
  } catch (error) {
    return NextResponse.json(ResponseError('系统错误'))
  }
}
