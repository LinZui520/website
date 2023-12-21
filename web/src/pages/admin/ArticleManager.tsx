import {Outlet} from "react-router-dom";


const ArticleManager = () => {
  return (
    <div style={{width: '80vw'}}>
      <Outlet />
    </div>
  );
}

export default ArticleManager;