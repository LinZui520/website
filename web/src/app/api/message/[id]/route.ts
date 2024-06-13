import { NextRequest, NextResponse } from "next/server";
import { session } from "@/utils/session";
import { ResponseError, ResponseOK } from "@/types/response";
import prisma from "@/lib/prisma";

export const DELETE = async (_request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const { id, role } = await session()
    if (role === "block" || !id) return NextResponse.json(ResponseError('权限不足'))

    if (!params.id) return NextResponse.json(ResponseError('参数错误'))

    const message = await prisma.message.findUnique({
      where: { id: Number(params.id) }
    })
    if (!message) return NextResponse.json(ResponseError('留言不存在'))
    if (message.author !== Number(id) && role !== "admin" && role !== "root" && role !== "adsense") return NextResponse.json(ResponseError('权限不足'))

    await prisma.message.delete({
      where: {
        id: Number(params.id)
      }
    })

    return NextResponse.json(ResponseOK(null))
  } catch (error) {
    return NextResponse.json(ResponseError('系统错误'))
  }
}
