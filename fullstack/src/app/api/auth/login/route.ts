import {NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {ResponseError, ResponseOK} from "@/types/response";
import bcrypt from 'bcryptjs';

export const POST = async (request : Request) => {
  try {
    const { username, password } = await request.json()
    const user = await prisma.user.findFirst({
      where: { username }
    })
    if (!user) return NextResponse.json(ResponseError('账号或密码错误'))
    if (!bcrypt.compareSync(password, user.username)) {
      return NextResponse.json(ResponseError('账号或密码错误'))
    }
    return NextResponse.json(ResponseOK(user))
  } catch (error) {
    throw error
  }
}