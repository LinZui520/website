'use client'

import { useState } from "react";
import request from "@/lib/axios";

const Page = () => {

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')

  const register = async () => {
    const res = request({
      url: '/auth/register',
      method: 'POST',
      data: {
        username, password,
        email, code,
      }
    })

    console.log(res)
  }

  const getCode = async () => {
    const res = await request({
      url: `/auth/verify`,
      method: 'POST',
      data: { email }
    })
    console.log(res)
  }

  return (
    <div className={"h-screen w-full flex flex-col justify-center items-center"}>
      <input
        type="text" placeholder="Username" name="Username" autoComplete="Username"
        onChange={e => setUsername(e.target.value)}
      />
      <input
        type="text" placeholder="Email" name="Email" autoComplete="Email"
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="text" placeholder="Code" name="Code" autoComplete="Code"
        onChange={e => setCode(e.target.value)}
      />
      <input
        type="password" placeholder="Password" name="Password" autoComplete="Password"
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={getCode}>验证码</button>
      <button onClick={register}>注册</button>
    </div>
  );
}

export default Page;
