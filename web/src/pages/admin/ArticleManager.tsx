import {Outlet} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../redux";
import NotFind from "../NotFind";


const ArticleManager = () => {

  const user = useSelector((state: RootState) => state.user)

  return (
    user.power < 0 ? <div className={"w-[80vw]"}><NotFind /></div> :
    <div className={"w-[80vw]"}>
      <Outlet />
    </div>
  );
}

export default ArticleManager;