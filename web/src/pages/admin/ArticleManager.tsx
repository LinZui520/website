import {Outlet} from "react-router-dom";


const ArticleManager = () => {
  return (
    <div className={"w-[80vw]"}>
      <Outlet />
    </div>
  );
}

export default ArticleManager;