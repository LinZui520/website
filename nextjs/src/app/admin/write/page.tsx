'use client'

import React, { useState } from 'react';
import { MdEditor, config } from 'md-editor-rt';
import MarkExtension from "markdown-it-mark";
import 'md-editor-rt/lib/style.css';
import { Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { motion } from "framer-motion";
import request from '@/lib/axios';

config({
  markdownItConfig(md) {
    md.use(MarkExtension);
  }
})

const Page = () => {

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const {isOpen, onOpen, onClose} = useDisclosure();

  const upload = async () => {
    const res = await request({
      url: '/blog',
      method: 'POST',
      data: { title, content }
    })
    return res.data.code === 200
  }

  return (
    <>
      <Modal
        size={"md"}
        backdrop={"blur"}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">请输入标题</ModalHeader>
              <ModalBody>
                <Input
                  size={"md"} type="text" label="标题"
                  value={title} onChange={(e) => setTitle(e.target.value)}
                  endContent={
                    <svg
                      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
                      width="18" height="18"
                    >
                      <path d="M192 32c0 17.7 14.3 32 32 32c123.7 0 224 100.3 224 224c0 17.7 14.3 32 32 32s32-14.3 32-32C512 128.9 383.1 0 224 0c-17.7 0-32 14.3-32 32zm0 96c0 17.7 14.3 32 32 32c70.7 0 128 57.3 128 128c0 17.7 14.3 32 32 32s32-14.3 32-32c0-106-86-192-192-192c-17.7 0-32 14.3-32 32zM96 144c0-26.5-21.5-48-48-48S0 117.5 0 144V368c0 79.5 64.5 144 144 144s144-64.5 144-144s-64.5-144-144-144H128v96h16c26.5 0 48 21.5 48 48s-21.5 48-48 48s-48-21.5-48-48V144z"/>
                    </svg>
                  }
                />
              </ModalBody>
              <ModalFooter className={"flex flex-row justify-evenly"}>
                <motion.button
                  onClick={() => upload().then(res => res && onClose())}
                  initial={{ scale: 0.9 }}
                  whileHover={{ scale: 1, opacity: 0.9 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-[64px] h-[40px] bg-[#1d1d1f] text-[#fbfbfd] font-bold text-lg rounded-[12px] border-[1px] border-[#1d1d1f] hover:bg-[#1d1d1f] hover:text-[#fbfbfd]"
                >
                  上传
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
    </>
  );
}

export default Page;
