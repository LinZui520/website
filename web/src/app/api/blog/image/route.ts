import { NextRequest, NextResponse } from "next/server";
import { session } from "@/utils/session";
import { ResponseError, ResponseOK } from "@/types/response";
import { existsSync, promises } from 'fs';
import prisma from "@/lib/prisma";

export interface Image {
  id: number
  author: number
  filename: string
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

    const images = await prisma.image.findMany({
      select: {
        id: true, author: true, filename: true, create: true,
        User: {
          select: {
            id: true, avatar: true, username: true, email: true,
            password: false, power: true, register: false, login: false,
          }
        }
      },
      orderBy: { create: 'desc' }
    })

    return NextResponse.json(ResponseOK(images))
  } catch (error) {
    return NextResponse.json(ResponseError('系统错误'))
  }
}

export const POST = async (request: NextRequest) => {
  try {
    const { id, role } = await session()
    if (role === "block" || !id) return NextResponse.json(ResponseError('权限不足'))

    const file = (await request.formData()).get('file')

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(ResponseError('文件格式错误'));
    }

    const filename = Date.now().toString() + '.png'

    const buffer = await file.arrayBuffer();

    await promises.writeFile(`${process.env.IMAGE_DIRECTORY}${filename}`, Buffer.from(buffer))

    if (!existsSync(`${process.env.IMAGE_DIRECTORY}${filename}`)) return NextResponse.json(ResponseError('文件上传失败'))

    const image = await prisma.image.create({
      data: {
        author: Number(id),
        filename,
        create: new Date(+new Date() + 8 * 3600 * 1000)
      }
    })

    return NextResponse.json(ResponseOK(image))
  } catch (error) {
    console.log(error)
    return NextResponse.json(ResponseError('系统错误'))
  }
}