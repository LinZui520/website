import { Outlet } from "react-router-dom"
import Menu from "../components/index/Menu";


const Index = () => {
  return (
    <div className={"bg-[#fbfbfd]"}>
      <Menu />
      <Outlet />
    </div>
  )
}

export default Index;