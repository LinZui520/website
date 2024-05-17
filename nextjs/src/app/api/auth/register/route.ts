import prisma from "@/lib/prisma";
import { ResponseError, ResponseOK } from "@/types/response";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import redis from "@/lib/redis";

export const POST = async (request : NextRequest) => {
  try {
    const { username, email, password, code } = await request.json()
    if (!username || !email || !password || !code) return NextResponse.json(ResponseError('参数错误'))

    const redisCode = await redis.get(email)
    if (code !== redisCode) {
      return NextResponse.json(ResponseError('验证码错误'))
    }

    const salt = bcrypt.genSaltSync(4)
    const hash = bcrypt.hashSync(password, salt)
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hash,
        register: new Date(),
        login: new Date()
      }
    })
    return NextResponse.json(ResponseOK(user))
  } catch (error) {
    return NextResponse.json(ResponseError('系统错误'))
  }
}
