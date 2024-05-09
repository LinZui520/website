import prisma from "@/lib/prisma"
import {ResponseError, ResponseOK} from "@/types/response"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs";

export const POST = async (request : Request) => {
  try {
    const { username, email, password } = await request.json()
    const salt = bcrypt.genSaltSync(4);
    const hash = bcrypt.hashSync(password, salt);
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
  } finally {
    await prisma.$disconnect();
  }
}