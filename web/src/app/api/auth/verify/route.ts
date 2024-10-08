import { NextRequest, NextResponse } from "next/server";
import { ResponseError, ResponseOK } from "@/types/response";
import transporter from "@/lib/nodemailer";
import redis from "@/lib/redis";

export const POST = async (request: NextRequest) => {
  try {
    const { email } = await request.json()
    if (await redis.get(email) !== null) {
      return NextResponse.json(ResponseError('请勿频繁发送验证码'))
    }
    const code = Math.floor(Math.random() * 1000000).toString()
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: process.env.SMTP_SUBJECT,
      text: process.env.SMTP_TEXT + code
    })
    await redis.set(email, code, 'EX', 60 * 5)

    return NextResponse.json(ResponseOK(null))
  } catch (error) {
    return NextResponse.json(ResponseError('系统错误'))
  }
}
