import { NextRequest, NextResponse } from "next/server";
import { session } from "@/utils/session";
import { ResponseError, ResponseOK } from "@/types/response";
import { existsSync, promises } from 'fs';
import prisma from "@/lib/prisma";

export const POST = async (request: NextRequest) => {
  try {
    const { id, role } = await session()
    if (role === "block" || !id) return NextResponse.json(ResponseError('权限不足'))

    const file = (await request.formData()).get('file')

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(ResponseError('文件上传失败'));
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