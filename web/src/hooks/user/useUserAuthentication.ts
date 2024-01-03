import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {useEffect, useState} from "react";
import cookie from "react-cookies";
import {UserTokenLogin} from "../../api/user";
import {setUser} from "../../store/user";


const useUserAuthentication = () => {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user)
  const [isHookFinished, setHookFinished] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (cookie.load('token') !== undefined && user.id === 0 ) {
        try {
          const res = await UserTokenLogin();
          if (res.data.code === 200) {
            cookie.save('token', res.data.data.token, {
              path: "/",
              expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            });
            dispatch(setUser(res.data.data));
          }
        } catch (_) {

        } finally {
          setHookFinished(true);
        }
      }
    }
    fetchData().then(() => {})
  }, [user, dispatch]);

  return isHookFinished;
}

export default useUserAuthentication;