'use client'

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic'
import { useCallback, useRef, useState } from "react";
import { Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import request from '@/lib/axios';
import { MessageWallHandles } from "@/components/(web)/MessageWall";
import { useSession } from "next-auth/react";
import NotFound from "@/app/not-found";

const MessageWall = dynamic(
  () => import("@/components/(web)/MessageWall"),
  { ssr: false }
)

const Page = () => {

  const [isHovered, setIsHovered] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const ref = useRef<MessageWallHandles | null>(null)
  const [message, setMessage] = useState('')

  const uploadMessage = useCallback(async () => {
    try {
      const res = await request({
        url: '/message',
        method: 'POST',
        data: { content: message }
      })
      if (res.data.code === 200) {
        setMessage('')
        ref.current?.fetchMessages().then(() => {})
        onClose()
        ref.current?.toast.success('留言成功')
      } else {
        ref.current?.toast.warning(res.data.message)
      }
    } catch (_) {
      ref.current?.toast.error('系统错误')
    }
  }, [message, onClose])

  const session = useSession()

  if (!session || !session.data || !session.data.user) return <NotFound />

  return (
    <>
      <Modal
        size={"md"}
        backdrop={"blur"}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1"></ModalHeader>
              <ModalBody>
                <Input
                  size={"md"} type="text" label="留言"
                  value={message} onChange={(e) => setMessage(e.target.value)}
                  endContent={
                    <svg
                      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
                      width="18" height="18"
                    >
                      <path fill={"#1d1d1f"} d="M64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64h96v80c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64z"/>
                    </svg>
                  }
                />
              </ModalBody>
              <ModalFooter className={"flex flex-row justify-evenly"}>
                <motion.button
                  onClick={() => uploadMessage()}
                  initial={{ scale: 0.9 }}
                  whileHover={{ scale: 1, opacity: 0.9 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-[64px] h-[40px] bg-[#1d1d1f] text-[#fbfbfd] font-bold text-lg rounded-[12px] border-[1px] border-[#1d1d1f] hover:bg-[#1d1d1f] hover:text-[#fbfbfd]"
                >
                  留言
                </motion.button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <motion.svg
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="32" height="32"
        className={"z-40 top-[25px] right-[82px] cursor-pointer fixed"}
        onClick={() => onOpen()}
        animate={isHovered ? "hover" : "none"}
        whileHover={{ scale: 1.1 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <motion.path
          initial={{ fill: "#1d1d1f" }}
          variants={{
            hover: { fill: "#11efef" } ,
            none: { fill: "#1d1d1f" }
          }}
          transition={{
            duration: 0.618, type: "spring", stiffness: 100, damping: 10
          }}
          d="M481 31C445.1-4.8 386.9-4.8 351 31l-15 15L322.9 33C294.8 4.9 249.2 4.9 221.1 33L135 119c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0L255 66.9c9.4-9.4 24.6-9.4 33.9 0L302.1 80 186.3 195.7 316.3 325.7 481 161c35.9-35.9 35.9-94.1 0-129.9zM293.7 348.3L163.7 218.3 99.5 282.5c-48 48-80.8 109.2-94.1 175.8l-5 25c-1.6 7.9 .9 16 6.6 21.7s13.8 8.1 21.7 6.6l25-5c66.6-13.3 127.8-46.1 175.8-94.1l64.2-64.2z"
        />
      </motion.svg>
      <MessageWall event={ref} />
    </>
  );
}

export default Page;
