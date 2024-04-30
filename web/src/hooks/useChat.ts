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
      switch (message?.type) {
        case "pong": return
        case "conversations": return setConversations(message.data === null ? [] : message.data)
        case "count": return setCount(message.data)
        case "decrement": return setConversations(prevConversations => prevConversations.filter(conversation => conversation.id !== message.data))
        default: return setConversations((prevConversations) => [...prevConversations, message.data]);
      }
    };

    ws.onclose = () => setState("已断开")

    setWebSocket(ws);

    const pingServerInterval = setInterval(() => {
      ws?.send(JSON.stringify({
        type: 'ping',
        data: null
      }))
    }, 32000);

    return () => {
      clearInterval(pingServerInterval)
      ws.close()
    }
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