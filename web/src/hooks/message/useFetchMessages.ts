import {useCallback, useEffect, useState} from "react";
import {GetAllMessage} from "../../api/message";

export interface Message {
  id: number
  author: number
  avatar: string
  username: string
  content: string
  create: string
}

const useFetchMessages = () => {
  const [messages, setMessages] = useState<Message[]>([])

  const fetchData = useCallback(async () => {
    try {
      const res = await GetAllMessage();
      if (res.data.code === 200) {
        setMessages(res.data.data !== null ? res.data.data : []);
      } else {
        setMessages([])
      }
    } catch (_) {
      setMessages([])
    }
  }, []);

  useEffect(() => {
    fetchData().then(() => {});
  }, [fetchData]);

  return { messages, fetchData: fetchData };
}

export default useFetchMessages;