import prisma from "@/lib/prisma"
import redis from "@/lib/redis"
import { ResponseError, ResponseOK } from "@/types/response"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs";

export const PUT = async (request: NextRequest) => {
  try {
    const { email, password, code } = await request.json()
    if (!email || !password || !code) return NextResponse.json(ResponseError('参数错误'))

    const redisCode = await redis.get(email)
    if (code !== redisCode) {
      return NextResponse.json(ResponseError('验证码错误'))
    }

    const salt = bcrypt.genSaltSync(4)
    const hash = bcrypt.hashSync(password, salt)
    await prisma.user.update({
      where: { email },
      data: { password: hash }
    })
    
    return NextResponse.json(ResponseOK('密码修改成功'))
  } catch (error) {
    return NextResponse.json(ResponseError('系统错误'))
  } finally {
    await prisma.$disconnect()
  }
}
  