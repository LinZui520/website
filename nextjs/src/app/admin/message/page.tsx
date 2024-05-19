'use client'

import {
  Modal,
  ModalBody,
  ModalContent, ModalFooter, ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure
} from "@nextui-org/react";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { format } from "@/utils/time";
import { Message } from "@/app/api/message/route";
import request from "@/lib/axios";
import Loading from "@/app/loading";
import { motion } from "framer-motion";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Page = () => {

  const [messages, setMessages] = useState<Message[]>([])
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [content, setContent] = useState('')
  const [action, setAction] = useState<() => () => void>(() => () => () => {})


  const fetchMessages = useCallback(async () => {
    try {
      const res = await request({
        url: '/message', method: 'GET',
      })
      if (res.data.code === 200) {
        setMessages(res.data.data)
      }
    } catch (_) {

    }
  }, [])

  const deleteMessage = useCallback(async (id: number) => {
    try {
      const res = await request({
        url: `/message/${id}`, method: 'DELETE',
      })
      if (res.data.code === 200) {
        toast.success("删除成功")
        fetchMessages().then(() => {})
        onClose()
      } else {
        toast.warning(res.data.message)
      }
    } catch (_) {
      toast.error("系统错误")
    }
  },[onClose, fetchMessages])

  useEffect(() => {
    fetchMessages().then(() => {})
  }, [fetchMessages]);

  const renderCell = useCallback((message: Message, columnKey: React.Key) => {
    switch (columnKey) {
      case "username":
        return <div className={"relative flex items-center gap-2"}>
          <Image
            className={"rounded-full object-cover h-[24px] w-[24px]"}
            height={24} width={24} alt={""}
            src={`https://www.zhuguishihundan.cn/image/${message.User.avatar}`}
          />
          {message.User.username}
        </div>
      case "content":
        return <span>{message.content}</span>
      case "create":
        return <span>{format(new Date(message.create))}</span>
      case "actions":
        return <div className={"relative flex items-center gap-2"}>
          <Tooltip content="删除">
            <svg
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"
              width="24" height="24"
              className={"cursor-pointer active:opacity-50"}
              onClick={() => {
                setContent(message.content)
                setAction(() => () => deleteMessage(message.id))
                onOpen()
              }}
            >
              <path
                fill="#1d1d1f"
                d="M290.7 57.4L57.4 290.7c-25 25-25 65.5 0 90.5l80 80c12 12 28.3 18.7 45.3 18.7H288h9.4H512c17.7 0 32-14.3 32-32s-14.3-32-32-32H387.9L518.6 285.3c25-25 25-65.5 0-90.5L381.3 57.4c-25-25-65.5-25-90.5 0zM297.4 416H288l-105.4 0-80-80L227.3 211.3 364.7 348.7 297.4 416z"
              />
            </svg>
          </Tooltip>
        </div>
    }
  }, [onOpen, deleteMessage])

  const columns = [
    {name: "用户名", uid: "username"},
    {name: "内容", uid: "content"},
    {name: "创建时间", uid: "create"},
    {name: "操作", uid: "actions"}
  ];

  if (!messages || !messages.length) return <Loading/>

  return (
    <>
      <ToastContainer position="top-center" closeOnClick={true} />

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
              <ModalBody className={"flex flex-col justify-center items-center"}>
                确定删除留言
                <span className={"font-bold text-xl"}>{content}</span>
              </ModalBody>
              <ModalFooter className={"flex flex-row justify-evenly"}>
                <motion.button
                  onClick={() => action()}
                  initial={{ scale: 0.9 }}
                  whileHover={{ scale: 1, opacity: 0.9 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-[64px] h-[40px] bg-[#1d1d1f] text-[#fbfbfd] font-bold text-lg rounded-[12px] border-[1px] border-[#1d1d1f] hover:bg-[#1d1d1f] hover:text-[#fbfbfd]"
                >
                  确定
                </motion.button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Table
        isHeaderSticky
        className={"h-full w-full select-none"} aria-label="Messages"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
            {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={messages}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}

export default Page;
