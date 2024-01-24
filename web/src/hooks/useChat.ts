import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../redux";

interface Conversation {
  id: number
  author: number
  avatar: string
  username: string
  content: string
  create: string
}

const useChat = () => {

  const user = useSelector((state: RootState) => state.user)
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversation, setConversation] = useState("")
  const [count, setCount] = useState(0)
  const [state, setState] = useState('')

  useEffect(() => {
    const ws = new WebSocket(`ws://${window.location.hostname}/api/conversation/chat`)

    ws.onopen = () => setState("已连接")

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message === null) return
      if (message.type === "conversations") return message.data === null ? setConversations([]): setConversations(message.data)
      if (message.type === "count") return setCount(message.data)
      if (message.type === "decrement") return setConversations(prevConversations => prevConversations.filter(conversation => conversation.id !== message.data))
      return setConversations((prevConversations) => [...prevConversations, message.data]);
    };

    ws.onclose = () => setState("已断开")

    setWebSocket(ws);
    return () => ws.close()
  }, []);

  const sendConversation = () => {
    if (!webSocket || conversation === "") return
    webSocket.send(JSON.stringify({
      type: 'increment',
      data: {
        id: 0,
        author: user.id,
        avatar: user.avatar,
        username: user.username,
        content: conversation,
        create: new Date()
      }
    }))
    setConversation("")
  }

  const withdrawConversation = () => {
    if (!webSocket) return
    const userConversations = conversations.filter(conversation => conversation.author === user.id)
    if (userConversations.length === 0) return
    const lastConversation = userConversations[userConversations.length - 1]
    webSocket.send(JSON.stringify({
      type: 'decrement',
      data: {
        id: lastConversation.id,
        author: lastConversation.author,
        avatar: lastConversation.avatar,
        username: lastConversation.username,
        content: lastConversation.content,
        create: lastConversation.create
      }
    }))
  }

  return {
    user,
    state,
    count,
    conversations,
    conversation,
    setConversation,
    sendConversation,
    withdrawConversation
  }
}

export default useChat;