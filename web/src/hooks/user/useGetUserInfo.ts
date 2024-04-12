import {useCallback, useEffect, useState} from "react";
import {GetUserInfo} from "../../api/user";
import { User } from "./useFetchUsers";

const useGetUserInfo = (username: string) => {

  const [userInfo, setUserInfo] = useState<User>({id: 0, avatar: '', username: '', email: '', password: '', power: -1, register: '', login: ''})

  const fetchData = useCallback(async () => {
    try {
      const res = await GetUserInfo(username)
      if (res.data.code === 200) {
        setUserInfo(res.data.data)
      } else {
        setUserInfo({id: 0, avatar: '', username: '', email: '', password: '', power: -1, register: '', login: ''})
      }
    } catch (_) {
      setUserInfo({id: 0, avatar: '', username: '', email: '', password: '', power: -1, register: '', login: ''})
    }
  },[])


  useEffect(() => {
    fetchData().then(() => {});
  }, [fetchData]);

  return { userInfo };
}

export default useGetUserInfo;