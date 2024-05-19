'use client'

import { Ref, forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Message } from "@/app/api/message/route";
import request from "@/lib/axios";
import BulletScreen, { StyledBullet } from "rc-bullets-ts";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export interface MessageWallHandles {
  fetchMessages: () => Promise<void>,
  toast: typeof toast
}

const MessageWall = forwardRef((
  props: { event: Ref<MessageWallHandles> },
  _ref
) => {

  const [messages, setMessages] = useState<Message[]>([])
  const [speed, setSpeed] = useState(2048)

  const fetchMessages = useCallback(async () => {
    try {
      const res = await request({
        url: '/message', method: 'GET',
      })
      if (res.data.code === 200) {
        setMessages(res.data.data.sort(() => 0.5 - Math.random()))
        setSpeed(Math.max(768 ,Math.min(2048, 24 / (res.data.data.length + 1) * 1024)))
      } else {
        toast.warning("获取留言失败")
      }
    } catch (_) {
      toast.error("系统错误")
    }
  }, [])

  useImperativeHandle(props.event, () => ({
    fetchMessages: fetchMessages,
    toast: toast
  }))

  useEffect(() => {
    fetchMessages().then(() => {})
  }, [fetchMessages]);

  const screenElRef = useRef<HTMLDivElement>(null)
  const screenRef = useRef<InstanceType<typeof BulletScreen>>()
  const [index, setIndex] = useState(0)

  const pushMessage = useCallback(() => {
    if (messages.length === 0 || !screenRef.current) return

    if (index >= messages.length) return setIndex(0)

    screenRef.current.push(
      <StyledBullet
        className={"select-none"}
        head={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/image/${messages[index].User.avatar}`}
        msg={messages[index].content}
        backgroundColor={'#fbfbfd'}
        size="large"
      />, {}
    );

    setIndex(index + 1)
  },[index, messages])

  useEffect(() => {
    screenRef.current = new BulletScreen(screenElRef.current, { duration: 18 })
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
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [speed, messages, pushMessage])

  return (
    <>
      <ToastContainer position="top-center" closeOnClick={true} />
      <div className={"h-[5vh]"}/>
      <div ref={screenElRef} className={"w-full h-[93vh] max-h-[93vh] overflow-x-clip"}/>
    </>
  );
})

MessageWall.displayName = 'MessageWall';

export default MessageWall;
