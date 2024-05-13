import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ResponseError, ResponseOK } from "@/types/response";

export interface User {
  id: number;
  avatar: string;
  username: string;
  email: string;
  power: number;
  login: string;
}

export const GET = async (_request: NextRequest) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, avatar: true, username: true, email: true,
        password: false, power: true, register: false, login: true,
      }
    })
    return NextResponse.json(ResponseOK(users))
  } catch (error) {
    return NextResponse.json(ResponseError('系统错误'))
  } finally {
    await prisma.$disconnect();
  }
}