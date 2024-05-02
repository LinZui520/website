import { Outlet } from "react-router-dom"
import Menu from "../components/index/Menu";
import ScrollBar from "../components/index/ScrollBar";


const Index = () => {
  return (
    <div className={"bg-[#fbfbfd]"}>
      <Menu />
      <ScrollBar />
      <Outlet />
    </div>
  )
}

export default Index;