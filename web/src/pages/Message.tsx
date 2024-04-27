import BulletScreen, { StyledBullet } from "rc-bullets-ts";
import React, {useCallback, useEffect, useRef, useState} from "react";
import useFetchMessages from "../hooks/message/useFetchMessages";
import useUploadMessage from "../hooks/message/useUploadMessage";
import {motion} from "framer-motion";

const Message = () => {

  const { messages, fetchData } = useFetchMessages()
  const screenElRef = useRef<HTMLDivElement>(null)
  const screenRef = useRef<InstanceType<typeof BulletScreen>>()
  const [bullet, setBullet] = useState('')
  const [index, setIndex] = useState(0)
  const uploadMessage = useUploadMessage(fetchData, setBullet)

  const pushMessage = useCallback(() => {
    if (messages.length === 0) return

    if (index === 0) messages.sort(() => 0.5 - Math.random())

    if (index >= messages.length) return setIndex(0)

    screenRef.current?.push(
      <StyledBullet
        className={"select-none"}
        head={`${window.location.origin}/image/${messages[index].avatar}`}
        msg={messages[index].content}
        backgroundColor={'#fbfbfd'}
        size="large"
      />, {}
    );

    setIndex(index + 1)
  },[index, messages])

  useEffect(() => {
    screenRef.current = new BulletScreen(screenElRef.current, {duration: 16})
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout

    const handleVisibilityChange = () => {
      if (document.hidden) clearInterval(interval)
      else interval = setInterval(pushMessage, 2048)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    interval = setInterval(pushMessage, 2048)

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  }, [messages, index, pushMessage])


  return (
    <div className={"flex flex-col items-center h-screen w-screen"}>
      <div className={"h-[10vh]"}/>

      <div ref={screenElRef} className={"w-screen h-calc-32 overflow-x-clip"} />

      <div className={"w-screen h-[128px] flex flex-row items-center justify-center"}>
        <motion.input
          placeholder="留下点什么啦~ "
          value={bullet} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBullet(e.target.value)}
          className={
            "max-w-[60vw] w-[320px] h-[48px] border-2 mr-[32px] " +
            "border-[#888888] rounded-full px-[10px] outline-none z-10"
          }
          whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} whileFocus={{scale: 1.1}}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' ? uploadMessage(bullet) : null}
        />

        <motion.button
          className={
            "w-[48px] h-[48px] cursor-pointer border-[#888888] border-2 bg-[#fbfbfd] text-[#888888] " +
            "select-none rounded-full z-10 flex justify-center items-center"
          }
          onClick={() => uploadMessage(bullet)} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}
        >
          留言
        </motion.button>
      </div>

    </div>
  );
}

export default Message;