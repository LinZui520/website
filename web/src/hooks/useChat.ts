import {useEffect, useState} from "react";

interface Conversation {
  id: number
  author: number
  avatar: string
  username: string
  content: string
  create: string
}

const useChat = () => {

  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversation, setConversation] = useState("")

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/api/conversation/chat")
    ws.onopen = () => {
      console.log('WebSocket连接已打开');
    };

    ws.onmessage = (event) => {
      const conversations = JSON.parse(event.data);
      if (conversations === null) return
      if (Array.isArray(conversations)) {
        return setConversations(conversations)
      }
      return setConversations((prevConversations) => [...prevConversations, conversations]);
    };

    ws.onclose = () => {
      console.log('WebSocket连接已关闭');
    };

    setWebSocket(ws);
    return () => ws.close()
  }, []);

  const sendConversation = () => {
    if (webSocket && conversation !== "") {
      webSocket.send(JSON.stringify({content: conversation}))
      setConversation("")
    }
  }

  return {
    conversations,
    conversation,
    setConversation,
    sendConversation
  }
}

export default useChat;