'use client'

import { User } from "@/app/api/user/route";
import request from "@/lib/axios";
import {
  Modal, ModalBody,
  ModalContent, ModalFooter, ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip, useDisclosure
} from "@nextui-org/react";
import React, { useCallback, useEffect, useState } from "react";
import { Image } from "@nextui-org/image";
import Loading from "@/app/admin/loading";
import { format } from "@/utils/time";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from "framer-motion";

const Page = () => {

  const [users, setUsers] = useState<User[]>([])
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [username, setUsername] = useState("")
  const [action, setAction] = useState<() => () => void>(() => () => () => {})


  const fetchUsers = useCallback(async () => {
    try {
      const res = await request({
        url: '/user',
        method: 'GET',
      })
      if (res.data.code === 200) {
        setUsers(res.data.data)
      } else {
        toast.warning(res.data.message)
      }
    } catch (_) {
      toast.error("系统错误")
    }
  }, [])

  const blockUser = useCallback(async (id: number) => {
    try {
      const res = await request({
        url: '/user',
        method: 'PUT',
        data: {id, action: 'block'}
      })
      if (res.data.code === 200) {
        toast.success("操作成功")
        await fetchUsers()
        onClose()
      } else {
        toast.warning(res.data.message)
      }
    } catch (_) {
      toast.error("系统错误")
    }
  }, [fetchUsers, onClose])

  const boostUser = useCallback(async (id: number) => {
    try {
      const res = await request({
        url: '/user',
        method: 'PUT',
        data: {id, action: 'boost'}
      })
      if (res.data.code === 200) {
        toast.success("操作成功")
        await fetchUsers()
        onClose()
      } else {
        toast.warning(res.data.message)
      }
    } catch (_) {
      toast.error("系统错误")
    }
  },[fetchUsers, onClose])

  useEffect(() => {
    fetchUsers().then(() => {})
  }, [fetchUsers])

  const renderCell = useCallback((user: User, columnKey: React.Key) => {
    switch (columnKey) {
      case "username":
        return <div className={"relative flex items-center gap-2"}>
          <Image
            className={"rounded-full object-cover h-[24px] w-[24px]"}
            height={24} width={24} alt={""}
            src={`${process.env.NEXT_PUBLIC_WEBSITE_IMAGE_URL}${user.avatar}`}
          />
          {user.username}
        </div>
      case "email":
        return <div>{user.email}</div>
      case "power":
        return <div>
          {user.power < 0 ? "人下人" : user.power < 1 ? "普通用户" : user.power < 2 ? "管理员" : "站长"}
        </div>
      case "login":
        return <span>{format(new Date(user.login))}</span>
      case "actions":
        return <div className={"relative flex items-center gap-2"}>
          <Tooltip content="降低权限">
            <svg
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
              width="24" height="24"
              className={"cursor-pointer active:opacity-50"}
              onClick={() => {
                setUsername(user.username)
                setAction(() => () => blockUser(user.id))
                onOpen()
              }}
            >
              <path fill="#1d1d1f" d="M256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM127 281c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l71 71L232 136c0-13.3 10.7-24 24-24s24 10.7 24 24l0 182.1 71-71c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9L273 393c-9.4 9.4-24.6 9.4-33.9 0L127 281z" />
            </svg>
          </Tooltip>

          <Tooltip content="增加权限">
            <svg
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
              width="24" height="24"
              className={"cursor-pointer active:opacity-50"}
              onClick={() => {
                setUsername(user.username)
                setAction(() => () => boostUser(user.id))
                onOpen()
              }}
            >
              <path
                fill="#1d1d1f"
                d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM385 231c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-71-71V376c0 13.3-10.7 24-24 24s-24-10.7-24-24V193.9l-71 71c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9L239 119c9.4-9.4 24.6-9.4 33.9 0L385 231z"
              />
            </svg>
          </Tooltip>
        </div>
    }
  }, [onOpen, setAction, blockUser, boostUser])

  const columns = [
    {name: "用户名", uid: "username"},
    {name: "邮箱", uid: "email"},
    {name: "权限", uid: "power"},
    {name: "最近登录时间", uid: "login"},
    {name: "操作", uid: "actions"}
  ];

  return (
    !users || !users.length ? <div className={"h-calc-84 w-full"}><Loading/></div> :
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: 'easeInOut' }}
      className={"bg-[#fbfbfd] h-calc-84 w-full"}
    >
      <ToastContainer position="top-center" closeOnClick={true} />
      <Modal
        size={"md"}
        backdrop={"blur"}
        isOpen={isOpen}
        onClose={onClose}
        placement={"center"}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1"></ModalHeader>
              <ModalBody className={"flex flex-col justify-center items-center"}>
                确定操作用户
                <span className={"font-bold text-xl"}>{username}</span>
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
        className={"h-full w-full select-none"} aria-label="Users"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={users}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </motion.div>
  );
}

export default Page;
