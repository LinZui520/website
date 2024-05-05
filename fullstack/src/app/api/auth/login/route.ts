import { signIn } from "@/lib/auth";
import {NextResponse} from "next/server";

export const POST = async (request : Request) => {
  try {
    const { username, password } = await request.json()
    const res = await signIn('credentials', {username, password, redirect: false})
    console.log(res)
    return NextResponse.json('ok')
  } catch (error) {
    console.log(error)
    throw error
  }
}