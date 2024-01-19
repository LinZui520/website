import {useSelector} from "react-redux";
import {RootState} from "../redux";
import NotFind from "./NotFind";


const Chat = () => {

  const user = useSelector((state: RootState) => state.user)


  return (
    user.id === 0 ? <NotFind /> :
    <div>

    </div>
  );
}

export default Chat;