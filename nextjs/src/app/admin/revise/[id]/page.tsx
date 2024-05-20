'use client'

import React, {useCallback, useEffect, useState} from 'react';
import { MdEditor, config } from 'md-editor-rt';
import MarkExtension from "markdown-it-mark";
import 'md-editor-rt/lib/style.css';
import { Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { motion } from "framer-motion";
import request from '@/lib/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

config({
  markdownItConfig(md) {
    md.use(MarkExtension);
  }
})

const Page = ({ params }: { params: { id: string } }) => {

  const [id, setId] = useState(0)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchBlog = useCallback(async () => {
    try {
      const res = await request({
        url: `/blog/${params.id}`,
        method: 'GET',
      })
      if (res.data.code === 200) {
        setId(res.data.data.id)
        setTitle(res.data.data.title)
        setContent(res.data.data.content)
      } else {
        toast.warning(res.data.message)
      }
    } catch (_) {
      toast.error("系统错误")
    }
  }, [params.id])

  useEffect(() => {
    fetchBlog().then(() => {})
  }, [fetchBlog])

  const updateBlog = async () => {
    try {
      const res = await request({
        url: `/blog/${id}`,
        method: 'PUT',
        data: {title, content}
      })
      return res.data.code === 200 ? Promise.resolve() : Promise.reject(res.data.message)
    } catch (_) {
      return Promise.reject("系统错误")
    }
  }

  return (
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
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"></ModalHeader>
              <ModalBody>
                <Input
                  size={"md"} type="text" label="标题"
                  value={title} onChange={(e) => setTitle(e.target.value)}
                  endContent={
                    <svg
                      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
                      width="18" height="18"
                    >
                      <path fill="#1d1d1f" d="M192 32c0 17.7 14.3 32 32 32c123.7 0 224 100.3 224 224c0 17.7 14.3 32 32 32s32-14.3 32-32C512 128.9 383.1 0 224 0c-17.7 0-32 14.3-32 32zm0 96c0 17.7 14.3 32 32 32c70.7 0 128 57.3 128 128c0 17.7 14.3 32 32 32s32-14.3 32-32c0-106-86-192-192-192c-17.7 0-32 14.3-32 32zM96 144c0-26.5-21.5-48-48-48S0 117.5 0 144V368c0 79.5 64.5 144 144 144s144-64.5 144-144s-64.5-144-144-144H128v96h16c26.5 0 48 21.5 48 48s-21.5 48-48 48s-48-21.5-48-48V144z" />
                    </svg>
                  }
                />
              </ModalBody>
              <ModalFooter className={"flex flex-row justify-evenly"}>
                <motion.button
                  onClick={() => toast.promise(updateBlog, {
                    pending: '正在修改博客',
                    success: {
                      render: () => {
                        setTitle('')
                        setContent('')
                        onClose()
                        return '修改成功'
                      }
                    },
                    error: {
                      render: ({ data }: { data: string }) => data
                    }
                  })}
                  initial={{ scale: 0.9 }}
                  whileHover={{ scale: 1, opacity: 0.9 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-[64px] h-[40px] bg-[#1d1d1f] text-[#fbfbfd] font-bold text-lg rounded-[12px] border-[1px] border-[#1d1d1f] hover:bg-[#1d1d1f] hover:text-[#fbfbfd]"
                >
                  修改
                </motion.button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <MdEditor
        className={"min-h-full w-full"}
        modelValue={content}
        onChange={setContent}
        toolbars={[
          'sub', 'sup', '-',
          'link', 'image', '-',
          'save', '-',
          '=', 'pageFullscreen', 'fullscreen', 'preview', 'previewOnly'
        ]}
        onSave={() => onOpen()}
        onUploadImg={() => {}}
      />
    </motion.div>
  );
}

export default Page;
