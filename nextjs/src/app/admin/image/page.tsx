'use client'

import React, {useCallback, useEffect, useState} from "react";
import request from "@/lib/axios";
import { Image as IMAGE } from "@/app/api/blog/image/route";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Modal,
  ModalBody,
  ModalContent, ModalFooter, ModalHeader,
  Table, TableBody, TableCell,
  TableColumn,
  TableHeader, TableRow, Tooltip, useDisclosure
} from "@nextui-org/react";
import { Image as IMG } from "@nextui-org/image";
import Image from "next/image";
import { format } from "@/utils/time";
import Loading from "@/app/loading";
import { motion } from "framer-motion";

const Page = () => {

  const [images, setImages] = useState<IMAGE[]>([])
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [id, setId] = useState<number>(0)

  const fetchImages = useCallback(async () => {
    try {
      const res = await request({
        url: '/blog/image', method: 'GET',
      })
      if (res.data.code === 200) {
        setImages(res.data.data)
      } else {
        toast.warning(res.data.message)
      }
    } catch (_) {
      toast.error("系统错误")
    }
  }, [])

  const deleteImage = useCallback(async () => {
    try {
      const res = await request({
        url: `/blog/image/${id}`, method: 'DELETE',
      })
      if (res.data.code === 200) {
        toast.success("删除成功")
        fetchImages().then(() => {})
        onClose()
      } else {
        toast.warning(res.data.message)
      }
    } catch (_) {
      toast.error("系统错误")
    }
  }, [onClose, fetchImages, id])

  useEffect(() => {
    fetchImages().then(() => {})
  }, [fetchImages])

  const renderCell = useCallback((image: IMAGE, columnKey: React.Key) => {
    switch (columnKey) {
      case "username":
        return <div className={"relative flex items-center gap-2"}>
          <Image
            className={"rounded-full object-cover h-[24px] w-[24px]"}
            height={24} width={24} alt={""}
            src={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/image/${image.User.avatar}`}
          />
          {image.User.username}
        </div>
      case "filename":
        return <IMG
          height={256} width={256} alt={""}
          src={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/image/${image.filename}`}
        />
      case "create":
        return <span>{format(new Date(image.create))}</span>
      case "actions":
        return <div className={"relative flex items-center gap-2"}>
          <Tooltip content="删除">
            <svg
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
              width="24" height="24"
              className={"cursor-pointer active:opacity-50"}
              onClick={() => {
                setId(image.id)
                onOpen()
              }}
            >
              <path fill="#1d1d1f" d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
            </svg>
          </Tooltip>
        </div>
    }
  }, [onOpen])

  const columns = [
    {name: "用户名", uid: "username"},
    {name: "图片", uid: "filename"},
    {name: "创建时间", uid: "create"},
    {name: "操作", uid: "actions"}
  ];

  if (!images || !images.length) return <Loading/>

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: 'easeInOut' }}
      className={"bg-[#fbfbfd] h-calc-84 w-full"}
    >
      <ToastContainer position="top-center" closeOnClick={true}/>

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
                确定删除该图片
              </ModalBody>
              <ModalFooter className={"flex flex-row justify-evenly"}>
                <motion.button
                  onClick={() => deleteImage()}
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
        className={"h-full w-full select-none"} aria-label="Images"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={images}>
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
