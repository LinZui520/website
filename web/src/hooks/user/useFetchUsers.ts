import {useCallback, useEffect, useState} from "react";
import {GetAllUser} from "../../api/user";

export interface User {
  id: number,
  avatar: string,
  username: string,
  email: string,
  password: string,
  power: number,
  register: string,
  login: string,
}

const useFetchUsers = () => {

  const [users, setUsers] = useState<User[]>([])

  const fetchData = useCallback(async () => {
    try {
      const res = await GetAllUser();
      if (res.data.code === 200) {
        setUsers(res.data.data !== null ? res.data.data : []);
      } else {
        setUsers([])
      }
    } catch (_) {
      setUsers([])
    }
  }, []);

  useEffect(() => {
    fetchData().then(() => {});
  }, [fetchData]);

  return { users, fetchData: fetchData };
}


export default useFetchUsers;