'use client'

import { useState } from "react";

const Page = () => {

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const register = async () => {
    const res = await fetch('http://127.0.0.1:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username, email, password})
    })

    const data = await res.json()
    console.log(data)
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
        type="password" placeholder="Password" name="Password" autoComplete="Password"
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={register}>注册</button>
    </div>
  );
}

export default Page;
