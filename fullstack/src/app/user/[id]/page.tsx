'use client'

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const Page = ({ params }: { params: { id: string } }) => {

  const router = useRouter()

  const logout = async () => {
    try {
      await signOut({redirect: false})
      router.push('/')
      router.refresh()
    } catch (_) {

    }
  }

  return (
    <>
      <button onClick={logout}>退出登录</button>
      <h1>{params.id}</h1>
    </>
  );
}

export default Page;