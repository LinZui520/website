import { useEffect, useState } from "react";
import { GetAllMessage } from "../api/message";



interface Message {
  id: number,   
  author: number,
  nickname: string,
  content: string,
  creation: string,
}

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([])


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
    fetchData().then(() => {})
  }, [])

  return (
    <div style={{marginLeft: '10vw', marginRight: '10vw', height: '100vh', alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', fontSize: '2rem'}}>
      {messages.map(item => (
        <div>
          {item.content}
        </div>
      ))}
    </div>
  );
}

export default Messages;