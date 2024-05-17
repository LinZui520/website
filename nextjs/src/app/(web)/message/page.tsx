'use client'

import { useCallback, useEffect, useRef, useState } from "react";
import { Message } from "@/app/api/message/route";
import request from "@/lib/axios";
import BulletScreen, { StyledBullet } from "rc-bullets-ts";


const Page = () => {

  const [messages, setMessages] = useState<Message[]>([])
  const [speed, setSpeed] = useState(2048)

  const fetchMessages = useCallback(() => {
    request({
      url: '/message',
      method: 'GET',
    }).then(res => {
      setMessages(res.data.data)
      const speed = 24 / (res.data.data.length + 1)
      setSpeed(Math.max(768 ,Math.min(2048, speed * 1024)))
    })
  },[])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages]);

  const screenElRef = useRef<HTMLDivElement>(null)
  const screenRef = useRef<InstanceType<typeof BulletScreen>>()
  const [index, setIndex] = useState(0)

  const pushMessage = useCallback(() => {
    if (messages.length === 0) return

    if (index === 0) messages.sort(() => 0.5 - Math.random())

    if (index >= messages.length) return setIndex(0)

    screenRef.current?.push(
      <StyledBullet
        className={"select-none"}
        head={`https://www.zhuguishihundan.cn/image/${messages[index].User.avatar}`}
        msg={messages[index].content}
        backgroundColor={'#fbfbfd'}
        size="large"
      />, {}
    );

    setIndex(index + 1)
  },[index, messages])

  useEffect(() => {
    screenRef.current = new BulletScreen(screenElRef.current, {duration: 18})
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout

    const handleVisibilityChange = () => {
      if (document.hidden) clearInterval(interval)
      else interval = setInterval(pushMessage, speed)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    interval = setInterval(pushMessage, speed)

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  }, [speed, messages, index, pushMessage])

  return (
    <>
      <div className={"h-[5vh] max-h-[5vh]"}/>
      <div ref={screenElRef} className={"w-full h-[93vh] max-h-[93vh] overflow-x-clip"}/>
    </>
  );
}

export default Page;
