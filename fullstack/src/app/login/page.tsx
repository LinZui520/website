'use client'

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from 'next/navigation'

const Page = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const login = async () => {
    try {
      const response = await signIn('credentials', {
        username,
        password,
        redirect: false,
        redirectTo: '/'
      })
      console.log(response)
      if (response && response.ok) {
        router.push('/')
        router.refresh()
      }

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={"h-screen w-full flex flex-col justify-center items-center"}>
      <input
        type="text" placeholder="Username" name="Username" autoComplete="Username"
        onChange={e => setUsername(e.target.value)}
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
