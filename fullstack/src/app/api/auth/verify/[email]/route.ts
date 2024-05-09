import { NextRequest, NextResponse } from "next/server";
import { ResponseError, ResponseOK } from "@/types/response";
import transporter from "@/lib/nodemailer";
import redis from "@/lib/redis";


export const GET = async (_request: NextRequest, { params }: { params: { email: string } }) => {
  try {
    const code = Math.floor(Math.random() * 1000000);
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: params.email,
      subject: process.env.SMTP_SUBJECT,
      text: process.env.SMTP_TEXT + code.toString(),
    });
    redis.set(params.email, code.toString(), 'EX', 60 * 5);

    return NextResponse.json(ResponseOK(null))
  } catch (error) {
    return NextResponse.json(ResponseError('系统错误'))
  }
}