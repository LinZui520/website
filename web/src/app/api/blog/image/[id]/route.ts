import { NextRequest, NextResponse } from "next/server";
import { session } from "@/utils/session";
import { ResponseError, ResponseOK } from "@/types/response";
import prisma from "@/lib/prisma";
import { unlinkSync } from 'fs';


export const DELETE = async (_request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const { id, role } = await session()
    if (role === "block") return NextResponse.json(ResponseError('权限不足'))

    const image = await prisma.image.findUnique({
      where: { id: Number(params.id) }
    })
    if (!image) return NextResponse.json(ResponseError('图片不存在'))
    if (image.author !== Number(id) && role !== "admin" && role !== "root" && role !== "adsense") return NextResponse.json(ResponseError('权限不足'))

    await prisma.image.delete({ where: { id: Number(params.id) } })

    unlinkSync(`${process.env.IMAGE_DIRECTORY}${image.filename}`)

    return NextResponse.json(ResponseOK(null))
  } catch (error) {
    return NextResponse.json(ResponseError('系统错误'))
  }
}
