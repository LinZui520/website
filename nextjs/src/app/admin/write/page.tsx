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
