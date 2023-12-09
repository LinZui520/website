import { useEffect, useState } from "react";
import { GetAllMessage } from "../api/message";
import { AnimatePresence, motion } from "framer-motion";



interface Message {
  id: number,   
  author: number,
  nickname: string,
  content: string,
  creation: string,
}

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [selected, setSelected] = useState<Message | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await GetAllMessage();
        if (res.data.code === 200) {
          setMessages(res.data.data)
        }
      } catch (_) {

      } 
    }
    fetchData()
  }, [])

  return (
    <div style={{marginLeft: '10vw', marginRight: '10vw', height: '100vh', alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', fontSize: '2rem'}}>
       <AnimatePresence>
        {selected && (
          <motion.div
            key={selected.id}
            layoutId={String(selected.id)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.h5>{selected?.nickname}</motion.h5>
            <motion.h2>{selected?.content}</motion.h2>
            <motion.button onClick={() => setSelected(null)}>关闭</motion.button>
          </motion.div>
        )}
      </AnimatePresence>
       {messages.map((message) => (
        <motion.div
          key={message.id}
          layoutId={String(message.id)}
          onClick={() => setSelected(selected === message ? null : message)}
          style={{ cursor: 'pointer', background: '#f0f0f0' }}
        >
          <motion.h5>{message.nickname}</motion.h5>
          <motion.h2>{message.content}</motion.h2>
        </motion.div>
      ))}
    </div>
  );
}

export default Messages;