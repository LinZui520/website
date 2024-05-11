'use client'

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from 'next/navigation';

const Page = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const login = async () => {
    try {
      const response = await signIn('credentials', {
        email, password,
        redirect: false, redirectTo: '/'
      })
      if (response && !response.error) {
        router.push('/')
        router.refresh()
      } else {
        alert("账户或密码错误")
      }
    } catch (_) {

    }
  }

  return (
    <div className={"h-screen w-full flex flex-col justify-center items-center"}>
      <input
        type="email" placeholder="Email" name="Email" autoComplete="Email"
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password" placeholder="Password" name="Password"
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit" title="login" onClick={login}>
        Login
      </button>
    </div>
  );
}

export default Page;
