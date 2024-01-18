import {useCallback, useEffect, useState} from "react";
import {GetMessageByAuthor} from "../../api/message";
import {Message} from "./useFetchMessages";

const useFetchMessagesByAuthor = () => {
  const [messages, setMessages] = useState<Message[]>([])

  const fetchData = useCallback(async () => {
    try {
      const res = await GetMessageByAuthor();
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

export default useFetchMessagesByAuthor;