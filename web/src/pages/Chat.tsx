import NotFind from "./NotFind";
import useChat from "../hooks/useChat";
import React, {useLayoutEffect, useRef, useState} from "react";
import { motion } from "framer-motion";

const Chat = () => {

  const {
    user,
    state,
    count,
    conversations,
    conversation,
    setConversation,
    sendConversation,
    withdrawConversation
  } = useChat()

  const ref = useRef<HTMLDivElement | null>(null)
  const [isInitialScroll, setIsInitialScroll] = useState<boolean | undefined>();

  useLayoutEffect(() => {
    if (conversations.length === 0) return;
    if (ref.current === null) return;
    if (isInitialScroll === undefined) return;
    const list = ref.current;

    if (isInitialScroll) {
      list?.scrollTo({
        top: list.scrollHeight,
        behavior: "auto"
      });
      setIsInitialScroll(false);
    } else {
      list?.scrollTo({
        top: list.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [conversations, isInitialScroll]);

  useLayoutEffect(() => {
    setIsInitialScroll(true);
  }, []);

  return (
    user.id === 0 ? <NotFind /> :
    <div className={"h-screen w-screen flex flex-col items-center"}>
      <div className={"bg-[#f2f2f2] h-[5vh] w-[90vw] max-w-[1024px] text-[#9f9f9f] text-[12px] lg:text-[24px] flex flex-row justify-evenly items-center"}>
        <span>当前状态：{state}</span>
        <span>欢迎来到聊天室~</span>
        <span>当前在线人数：{count}</span>
      </div>
      <div ref={ref} className={"bg-[#f2f2f2] h-[85vh] w-[90vw] max-w-[1024px] overflow-auto"}>
        <ul className={"flex flex-col justify-center pl-[8px] pr-[8px] lg:pl-[16px] lg:pr-[16px]"}>
          {conversations.map(conversation => (
            <li
              key={conversation.id}
              className={
                "flex justify-start items-start mb-[16px] mt-[16px] " +
                (user.id === conversation.author ? "flex-row-reverse" : "flex-row")
              }
            >
              <img
                src={`${window.location.origin}/image/${conversation.avatar}`} alt={""}
                className={"w-[24px] h-[24px] lg:w-[48px] lg:h-[48px] object-contain rounded-full select-none"}
              />
              <div className={"ml-[8px] mr-[8px] lg:ml-[16px] lg:mr-[16px]"}>
                <div
                  className={
                    "flex text-[#9f9f9f] " + (user.id === conversation.author ? "flex-row-reverse" : "flex-row")
                  }
                >
                  <span className={"text-[12px] lg:text-[24px] select-none"}>
                    {conversation.username}
                  </span>
                  <span className={"text-[12px] lg:text-[24px] ml-[8px] mr-[8px] lg:ml-[16px] lg:mr-[16px] select-none"}>
                    {new Date(conversation.create).toLocaleString()}
                  </span>
                </div>
                <div className={"flex " + (user.id === conversation.author ? "flex-row-reverse" : "flex-row")}>
                  <span
                    className={
                        "text-[12px] lg:text-[24px] inline-block " +
                        "min-h-[24px] lg:min-h-[48px] max-w-[54vw] p-[6px] lg:p-[12px] " +
                        "rounded-[6px] lg:rounded-[12px] bg-[#0099ff] text-[#ffffff]"
                    }
                  >
                    {conversation.content}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>


      <div className={"h-[10vh] w-[90vw] max-w-[1024px] bg-[#f2f2f2] flex flex-row justify-evenly items-center"}>
        <input
          className={
            "w-[72vw] max-w-[819px] h-[4vh] lg:h-[8vh] border-2 " +
            "border-[#888888] rounded-[32px] px-[10px] outline-none"
          }
          type="text" placeholder="聊个天吧~（文明用语）~（回车发送）"
          value={conversation} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConversation(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' ? sendConversation() : null}
        />

        <motion.button
          whileHover={{scale: 1.2}} whileTap={{scale: 0.8}}
          className={"text-[7px] lg:text-[14px] h-[4vh] lg:h-[8vh] w-[4vh] lg:w-[8vh] border-2 border-[#888888] rounded-full"}
          onClick={withdrawConversation}
        >
          撤回
        </motion.button>
      </div>
    </div>
  );
}

export default Chat;