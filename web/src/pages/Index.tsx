import { Outlet } from "react-router-dom"
import Menu from "../components/Index/Menu";


const Index = () => {
  return (
    <div>
      <Menu />
      <Outlet />
    </div>
  )
}

export default Index;