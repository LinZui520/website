import BulletScreen, { StyledBullet } from "rc-bullets-ts";
import React, {useEffect, useRef, useState } from "react";
import useFetchMessages from "../hooks/message/useFetchMessages";
import useUploadMessage from "../hooks/message/useUploadMessage";

const Message = () => {

  const { messages, fetchData } = useFetchMessages()
  const screenElRef = useRef<HTMLDivElement>(null)
  const screenRef = useRef<InstanceType<typeof BulletScreen>>()
  const [bullet, setBullet] = useState('')
  const [index, setIndex] = useState(0)
  const uploadMessage = useUploadMessage(fetchData, setBullet)


  useEffect(() => {
    screenRef.current = new BulletScreen(screenElRef.current, {duration: 16})
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (messages.length === 0) return

      if (index >= messages.length) return setIndex(0)

      screenRef.current?.push(
        <StyledBullet
          className={"select-none"}
          head={"https://www.zhuguishihundan.cn/image/" + messages[index].avatar}
          msg={messages[index].content}
          backgroundColor={'#fbfbfd'}
          size="large"
        />, {}
      );

      setIndex(index + 1)
    }, 2048);

    return () => clearInterval(interval);
  }, [messages, index])


  return (
    <div ref={screenElRef} className={"flex flex-col justify-center items-center h-screen w-screen"}>
      <input
        placeholder="留下点什么啦~ （回车发送）"
        value={bullet} onChange={(e) => setBullet(e.target.value)}
        className={
          "w-[320px] h-[48px] mb-[32px] border-2 " +
          "border-[#888888] rounded-full px-[10px] outline-none z-10"
        }
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' ? uploadMessage(bullet) : null}
      />
    </div>
  );
}

export default Message;