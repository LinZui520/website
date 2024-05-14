'use client'
import { signOut, useSession } from "next-auth/react";

const Home = () => {

  const session = useSession()




  return (
    <div className={"bg-[#fbfbfd] flex flex-col items-center"}>
      {!!session.data && <div>已登录</div>}
      {!session.data && <div>未登录</div>}
      {!!session && <div>{session.data?.user?.name}</div>}
      <button onClick={() => signOut()}>退出登录</button>
      <h1 className={"font-bold text-[#1d1d1f]"}>我不吃牛肉</h1>
      <p>一个简约风格的网站</p>
      <div className={"w-full h-screen flex flex-col justify-center items-center"}>
        <div
          className={"w-[50vw] h-screen max-h-[100vh] bg-[#fbfbfd] flex flex-col justify-center items-center overflow-scroll"}>

          <div className={"h-[30vh] min-h-[30vh]"}>一个简约风格的网站</div>
          <div className={"h-[30vh] min-h-[30vh]"}>一个简约风格的网站</div>
          <div className={"h-[30vh] min-h-[30vh]"}>一个简约风格的网站</div>
          <div className={"h-[30vh] min-h-[30vh]"}>一个简约风格的网站</div>
          <div className={"h-[30vh] min-h-[30vh]"}>一个简约风格的网站</div>
          <div className={"h-[30vh] min-h-[30vh]"}>一个简约风格的网站</div>
        </div>
      </div>
      <p>一个简约风格的网站</p>
      <p>一个简约风格的网站</p>
      <div className={"h-[30vh] min-h-[30vh]"}></div>
      <div className={"h-[30vh] min-h-[300vh]"}></div>
    </div>
  );
}

export default Home;
