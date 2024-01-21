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
  const [count, setCount] = useState(0)
  const [state, setState] = useState('')

  useEffect(() => {
    const ws = new WebSocket(`ws://${window.location.hostname}/api/conversation/chat`)
    ws.onopen = () => {
      return setState("已连接")
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message)
      if (message === null) return
      if (message.Type === "conversations") return setConversations(message.Data)
      if (message.Type === "count") return setCount(message.Data)
      return setConversations((prevConversations) => [...prevConversations, message.Data]);
    };

    ws.onclose = () => {
      return setState("已断开")
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
    state,
    count,
    conversations,
    conversation,
    setConversation,
    sendConversation
  }
}

export default useChat;