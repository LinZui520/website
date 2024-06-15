'use client'

import { useEffect, useState } from "react";

const Page =  () => {

  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:3000/api/chat`)

    ws.onopen = () => console.log('已连接')

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message)
    };

    ws.onclose = () => console.log('已关闭')

    setWebSocket(ws);

    return () => ws.close()
  }, []);

  return (
    <div className={"h-screen w-full bg-[#fbfbfd] flex justify-center items-center"}>
      <span className={"sm:text-[18px] md:text-[22px] lg:text-[27px]"}>维护中</span>
    </div>
  );
}

export default Page;
